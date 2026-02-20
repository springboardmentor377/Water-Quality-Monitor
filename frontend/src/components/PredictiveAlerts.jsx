import React, { useState, useEffect } from 'react';

const PredictiveAlerts = () => {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lookbackDays, setLookbackDays] = useState(7);
  const [autoAnalysis, setAutoAnalysis] = useState(false);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await fetch('http://localhost:8000/stations/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStations(data);
      if (data.length > 0) {
        setSelectedStation(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  const analyzePredictions = async () => {
    if (!selectedStation) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/predict/analyze/${selectedStation}?lookback_days=${lookbackDays}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPredictions(data.predicted_alerts);
    } catch (error) {
      console.error('Error analyzing predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendAnalysis = async () => {
    if (!selectedStation) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/predict/trends/${selectedStation}?lookback_days=${lookbackDays}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setTrends(data);
      setPredictions(data.predictions);
    } catch (error) {
      console.error('Error fetching trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const runAutoAnalysis = async () => {
    if (user?.role !== 'authority') {
      alert('Only authorities can run auto-prediction analysis');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/predict/auto-predict', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      alert(`Analysis complete! Created ${data.alerts_created} alerts from ${data.stations_analyzed} stations.`);
      setAutoAnalysis(true);
      setTimeout(() => setAutoAnalysis(false), 3000);
    } catch (error) {
      console.error('Error running auto-analysis:', error);
      alert('Error running auto-prediction analysis');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    if (!severity) return '#64748b';
    const colors = {
      'critical': '#dc2626',
      'high': '#f97316',
      'medium': '#eab308',
      'low': '#06d6a0'
    };
    return colors[severity] || '#64748b';
  };

  const getSeverityBg = (severity) => {
    if (!severity) return 'var(--bg-glass)';
    const colors = {
      'critical': 'rgba(220,38,38,0.08)',
      'high': 'rgba(249,115,22,0.08)',
      'medium': 'rgba(234,179,8,0.08)',
      'low': 'rgba(6,214,160,0.08)'
    };
    return colors[severity] || 'var(--bg-glass)';
  };

  const selectStyle = {
    padding: '10px 14px',
    border: '1px solid var(--border-subtle)',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text-primary)',
    background: 'var(--bg-glass)',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    outline: 'none',
  };

  return (
    <div className="page-container">
      {/* Hero Header */}
      <div className="glass-card" style={{
        padding: '28px',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(6,214,160,0.08) 0%, rgba(99,102,241,0.06) 100%)',
        borderColor: 'var(--border-accent)',
      }}>
        <h1 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          🔮 Predictive Alerts
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>
          AI-powered water quality trend analysis and predictions
        </p>
      </div>

      {/* Controls Card */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--text-primary)', marginTop: 0, marginBottom: '16px', fontSize: '16px', fontWeight: '700' }}>
          Analysis Settings
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '16px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Select Station
            </label>
            <select
              value={selectedStation || ''}
              onChange={(e) => setSelectedStation(Number(e.target.value))}
              style={selectStyle}
            >
              <option value="">Choose a station...</option>
              {stations.map(station => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Look-back Period
            </label>
            <select
              value={lookbackDays}
              onChange={(e) => setLookbackDays(Number(e.target.value))}
              style={selectStyle}
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
              <option value={60}>Last 60 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={analyzePredictions}
              disabled={!selectedStation || loading}
              className="btn-primary"
              style={{ opacity: !selectedStation || loading ? 0.5 : 1, width: '100%' }}
            >
              {loading ? 'Analyzing...' : '⚡ Analyze Trends'}
            </button>
          </div>
        </div>

        {user?.role === 'authority' && (
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: '8px' }}>
            <h3 style={{ color: 'var(--text-primary)', marginTop: 0, fontSize: '14px', fontWeight: '600' }}>Authority Actions</h3>
            <button
              onClick={runAutoAnalysis}
              disabled={loading}
              className="btn-secondary"
              style={{ opacity: loading ? 0.5 : 1 }}
            >
              {autoAnalysis ? '✓ Analysis Completed' : '🤖 Run Auto-Prediction for All Stations'}
            </button>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Analyzes all stations and automatically creates alerts for critical predictions.
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      {trends && (
        <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
          <h2 style={{ color: 'var(--text-primary)', marginTop: 0, marginBottom: '16px', fontSize: '16px', fontWeight: '700' }}>
            📊 Water Quality Statistics
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            {Object.entries(trends.statistics).map(([param, stats]) => (
              <div key={param} className="stat-card">
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent)' }}>
                  {stats.avg.toFixed(2)}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginTop: '4px' }}>
                  {param.replace(/_/g, ' ')}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {stats.min.toFixed(2)} – {stats.max.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Predicted Alerts */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--text-primary)', marginTop: 0, marginBottom: '16px', fontSize: '16px', fontWeight: '700' }}>
          ⚠️ Predicted Alerts
        </h2>
        {loading && (
          <p style={{ color: 'var(--accent)', fontWeight: '600', animation: 'pulse 1.5s infinite' }}>
            Analyzing water quality data...
          </p>
        )}

        {!loading && predictions.length === 0 && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>
            ✓ No concerning trends detected. Water quality appears normal.
          </p>
        )}

        {!loading && predictions.length > 0 && (
          <div>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap', fontSize: '13px' }}>
              <strong style={{ color: '#dc2626' }}>
                Critical: {predictions.filter(p => p.severity === 'critical').length}
              </strong>
              <span style={{ color: 'var(--text-muted)' }}>|</span>
              <strong style={{ color: '#f97316' }}>
                High: {predictions.filter(p => p.severity === 'high').length}
              </strong>
              <span style={{ color: 'var(--text-muted)' }}>|</span>
              <strong style={{ color: '#eab308' }}>
                Medium: {predictions.filter(p => p.severity === 'medium').length}
              </strong>
            </div>

            {predictions.map((prediction, idx) => (
              <div key={idx} style={{
                background: getSeverityBg(prediction.severity),
                border: `1px solid ${getSeverityColor(prediction.severity)}40`,
                borderLeft: `3px solid ${getSeverityColor(prediction.severity)}`,
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '10px',
                animation: `fadeInUp 0.3s ease ${idx * 0.05}s both`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{
                    background: getSeverityColor(prediction.severity),
                    color: 'white',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}>
                    {prediction.severity}
                  </span>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
                    {prediction.parameter.replace(/_/g, ' ').toUpperCase()}
                  </strong>
                </div>
                <p style={{ margin: '6px 0', color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5' }}>
                  {prediction.message}
                </p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>Current: <strong style={{ color: 'var(--text-primary)' }}>{prediction.recent_value.toFixed(3)}</strong></span>
                  <span>Trend: <strong style={{ color: 'var(--text-primary)' }}>{prediction.trend}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trend Summary */}
      {trends && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div className="stat-card" style={{ borderColor: 'rgba(220,38,38,0.2)' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#dc2626' }}>
              {trends.critical_alerts}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginTop: '4px' }}>
              Critical Alerts
            </div>
          </div>
          <div className="stat-card" style={{ borderColor: 'rgba(249,115,22,0.2)' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#f97316' }}>
              {trends.warning_alerts}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginTop: '4px' }}>
              Warning Alerts
            </div>
          </div>
          <div className="stat-card" style={{ borderColor: 'rgba(6,214,160,0.2)' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--accent)' }}>
              {trends.analysis_period_days}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginTop: '4px' }}>
              Days Analyzed
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictiveAlerts;
