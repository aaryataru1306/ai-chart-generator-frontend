import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import * as d3 from 'd3';

const API_BASE = 'http://localhost:3001/api/charts';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    backgroundColor: 'white',
    padding: '20px',
    borderBottom: '1px solid #ddd',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
    color: '#333'
  },
  statusConnected: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px'
  },
  statusDisconnected: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px'
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  controlPanel: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  controlGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '16px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#333'
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: 'white'
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed'
  },
  universalButton: {
    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 15px 0 rgba(116, 79, 168, 0.75)'
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },
  panel: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  panelTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
    color: '#333'
  },
  textarea: {
    width: '100%',
    height: '400px',
    padding: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontFamily: 'Consolas, monospace',
    fontSize: '14px',
    resize: 'none',
    outline: 'none'
  },
  universalTextarea: {
    width: '100%',
    height: '120px',
    padding: '16px',
    border: '2px solid #667eea',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    resize: 'none',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  chartArea: {
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '16px',
    backgroundColor: '#f9f9f9',
    minHeight: '400px',
    overflow: 'auto'
  },
  error: {
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    color: '#721c24',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '16px'
  },
  success: {
    backgroundColor: '#d1edcc',
    border: '1px solid #badbcc',
    color: '#155724',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '16px'
  },
  loading: {
    textAlign: 'center',
    padding: '40px'
  },
  spinner: {
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #007bff',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px'
  },
  placeholder: {
    textAlign: 'center',
    padding: '40px',
    color: '#6c757d'
  },
  exportButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  instructions: {
    backgroundColor: '#e7f3ff',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '20px'
  },
  instructionsTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#004085',
    marginBottom: '12px'
  },
  instructionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px'
  },
  instructionItem: {
    color: '#004085'
  },
  universalPanel: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
  },
  universalTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  universalSubtitle: {
    fontSize: '14px',
    opacity: 0.9,
    marginBottom: '16px'
  },
  exampleButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '6px 12px',
    margin: '4px',
    borderRadius: '16px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  detectedType: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '8px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    marginTop: '8px',
    display: 'inline-block'
  }
};

// Add CSS animation for spinner
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinnerStyle);

function App() {
  const [code, setCode] = useState(`function calculateSum(a, b) {
  if (a < 0 || b < 0) {
    console.log("Negative numbers not allowed");
    return null;
  }
  
  let result = a + b;
  console.log("Sum calculated: " + result);
  return result;
}

let x = 5;
let y = 10;
let sum = calculateSum(x, y);`);

  const [textPrompt, setTextPrompt] = useState(`How to start a successful online business`);
  const [inputType, setInputType] = useState('code'); // 'code' or 'prompt'
  
  // NEW: Universal AI input state
  const [universalInput, setUniversalInput] = useState('');
  const [showUniversal, setShowUniversal] = useState(true); // Show by default since it's the new feature
  const [detectedType, setDetectedType] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  const [language, setLanguage] = useState('javascript');
  const [chartType, setChartType] = useState('flowchart');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  
  const chartRef = useRef(null);
  const mindmapRef = useRef(null);

  // Check backend connection on load
  useEffect(() => {
    checkConnection();
    mermaid.initialize({ startOnLoad: true, theme: 'default' });
  }, []);

  // Render chart when chartData changes
  useEffect(() => {
    if (chartData) {
      renderChart();
    }
  }, [chartData, chartType]);

  // NEW: Get suggestions when universal input changes
  useEffect(() => {
    if (universalInput.length > 20) {
      getSuggestions();
    } else {
      setSuggestions([]);
      setDetectedType('');
    }
  }, [universalInput]);

  const checkConnection = async () => {
    try {
      const response = await fetch(`${API_BASE}/test`);
      const data = await response.json();
      setConnectionStatus(data.connected ? 'connected' : 'disconnected');
    } catch (err) {
      setConnectionStatus('disconnected');
      setError('Cannot connect to backend. Make sure your backend server is running on port 3001.');
    }
  };

  // NEW: Get chart type suggestions
  const getSuggestions = async () => {
    try {
      const response = await fetch(`${API_BASE}/suggest-type`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: universalInput })
      });

      const data = await response.json();
      if (data.success) {
        setDetectedType(data.detectedType);
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Suggestion error:', error);
    }
  };

  // NEW: Universal chart generation
  const generateUniversalChart = async () => {
    if (!universalInput.trim()) {
      setError('Please enter some text to generate a chart');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setChartData(null);

    try {
      const response = await fetch(`${API_BASE}/universal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          input: universalInput.trim(),
          chartType: null, // Let AI auto-detect
          autoDetect: true
        })
      });

      const data = await response.json();

      if (data.success) {
        setChartData({
          mermaidCode: data.mermaidCode,
          chartType: data.chartType
        });
        setChartType(data.chartType);
        
        if (data.fallback) {
          setError('Generated fallback chart - AI response could be improved');
        } else {
          setSuccess(`✨ Successfully generated ${data.chartType} chart! ${data.detectedType ? `(Auto-detected: ${data.detectedType})` : ''}`);
        }
      } else {
        setError(data.error || 'Failed to generate universal chart');
      }
    } catch (error) {
      setError('Network error: ' + error.message);
      console.error('Universal chart generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateChart = async () => {
    // Check if we have the required input based on chart type and input type
    if (chartType === 'mindmap' && inputType === 'prompt') {
      if (!textPrompt.trim()) {
        setError('Please enter a text prompt first!');
        return;
      }
    } else {
      if (!code.trim()) {
        setError('Please enter some code first!');
        return;
      }
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setChartData(null);

    try {
      const endpoint = `${API_BASE}/${chartType}`;
      const requestBody = {
        language,
        diagramType: chartType === 'diagram' ? 'sequence' : undefined
      };

      // Add appropriate input based on chart type and input type
      if (chartType === 'mindmap' && inputType === 'prompt') {
        requestBody.prompt = textPrompt;
        requestBody.inputType = 'prompt';
      } else {
        requestBody.code = code;
        requestBody.inputType = 'code';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (data.success) {
        setChartData(data);
        setError(null);
        setSuccess('✅ Chart generated successfully!');
      } else {
        setError(data.error || 'Failed to generate chart');
        if (data.fallback) {
          setChartData({ chartType, mermaidCode: data.fallback });
        }
      }
    } catch (err) {
      setError('Error generating chart: ' + err.message);
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderChart = async () => {
    if (!chartData) return;

    if (chartType === 'mindmap' && chartData.mindmapData) {
      renderMindmap(chartData.mindmapData);
    } else if (chartData.mermaidCode || chartData.diagramCode) {
      renderMermaidChart(chartData.mermaidCode || chartData.diagramCode);
    }
  };

  const renderMermaidChart = async (mermaidCode) => {
    if (!chartRef.current) return;
    
    try {
      chartRef.current.innerHTML = '';
      const { svg } = await mermaid.render('chart-' + Date.now(), mermaidCode);
      chartRef.current.innerHTML = svg;
    } catch (err) {
      console.error('Mermaid render error:', err);
      chartRef.current.innerHTML = `<div style="color: #dc3545; padding: 16px;">Error rendering chart: ${err.message}</div>`;
    }
  };

  const renderMindmap = (data) => {
    if (!mindmapRef.current) return;
    
    // Clear previous mindmap
    d3.select(mindmapRef.current).selectAll('*').remove();
    
    const width = 700;
    const height = 400;
    
    const svg = d3.select(mindmapRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    
    const g = svg.append('g')
      .attr('transform', 'translate(350,200)');
    
    const tree = d3.tree().size([360, 150]);
    const root = d3.hierarchy(data);
    
    tree(root);
    
    // Draw links
    g.selectAll('.link')
      .data(root.links())
      .enter().append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-width', 1.5)
      .attr('d', d3.linkRadial()
        .angle(d => d.x * Math.PI / 180)
        .radius(d => d.y));
    
    // Draw nodes
    const node = g.selectAll('.node')
      .data(root.descendants())
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `rotate(${d.x - 90}) translate(${d.y},0)`);
    
    node.append('circle')
      .attr('r', 4)
      .attr('fill', d => d.children ? '#007bff' : '#6c757d');
    
    node.append('text')
      .attr('dy', '0.31em')
      .attr('x', d => d.x < 180 === !d.children ? 6 : -6)
      .attr('text-anchor', d => d.x < 180 === !d.children ? 'start' : 'end')
      .attr('transform', d => d.x >= 180 ? 'rotate(180)' : null)
      .style('font-size', '12px')
      .text(d => d.data.name);
  };

  const exportChart = () => {
    if (!chartRef.current && !mindmapRef.current) return;
    
    const svgElement = chartType === 'mindmap' 
      ? mindmapRef.current.querySelector('svg')
      : chartRef.current.querySelector('svg');
    
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `chart-${chartType}-${Date.now()}.svg`;
      link.click();
      
      URL.revokeObjectURL(url);
    }
  };

  // Example inputs for the universal generator
  const universalExamples = [
    'How to learn programming step by step',
    'History of artificial intelligence',
    'Customer onboarding process',
    'React.js concepts breakdown',
    'Project management workflow',
    'Machine learning algorithms overview'
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>
            🤖 Universal AI Chart Generator
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={connectionStatus === 'connected' ? styles.statusConnected : styles.statusDisconnected}>
              {connectionStatus === 'connected' ? '✅ Ollama Connected' : '❌ Disconnected'}
            </div>
            <button
              onClick={checkConnection}
              style={{ ...styles.button, backgroundColor: '#6c757d', padding: '6px 12px', fontSize: '14px' }}
            >
              Test Connection
            </button>
          </div>
        </div>
      </header>

      <div style={styles.main}>
        {/* NEW: Universal AI Chart Generator */}
        <div style={styles.universalPanel}>
          <div style={styles.universalTitle}>
            ✨ Smart AI Chart Generator
            <button
              onClick={() => setShowUniversal(!showUniversal)}
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                cursor: 'pointer',
                marginLeft: 'auto'
              }}
            >
              {showUniversal ? '↑ Hide' : '↓ Show'}
            </button>
          </div>
          <div style={styles.universalSubtitle}>
            Enter any text and let AI automatically choose the best chart type for you!
          </div>

          {showUniversal && (
            <>
              <textarea
                style={styles.universalTextarea}
                placeholder="Enter any text to visualize... Examples:
• How to make a perfect cup of coffee
• Evolution of smartphones 1990-2024  
• Customer service workflow
• Machine learning concepts
• Project planning process"
                value={universalInput}
                onChange={(e) => setUniversalInput(e.target.value)}
              />

              {detectedType && (
                <div style={styles.detectedType}>
                  🎯 Auto-detected: <strong>{detectedType}</strong> content
                </div>
              )}

              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={generateUniversalChart}
                  disabled={loading || !universalInput.trim() || connectionStatus !== 'connected'}
                  style={{
                    ...styles.universalButton,
                    ...(loading || !universalInput.trim() || connectionStatus !== 'connected' ? {
                      background: '#6c757d',
                      boxShadow: 'none',
                      cursor: 'not-allowed'
                    } : {})
                  }}
                >
                  {loading ? '🤖 Generating...' : '🎨 Generate Smart Chart'}
                </button>

                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                  Quick examples:
                </span>
                {universalExamples.slice(0, 3).map(example => (
                  <button
                    key={example}
                    onClick={() => setUniversalInput(example)}
                    style={styles.exampleButton}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Traditional Controls - Keep all existing functionality */}
        <div style={styles.controlPanel}>
          <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#666' }}>
            📊 Traditional Chart Generation (Code-based)
          </h3>
          <div style={styles.controlGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Programming Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={styles.select}
                disabled={chartType === 'mindmap' && inputType === 'prompt'}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="csharp">C#</option>
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Chart Type
              </label>
              <select
                value={chartType}
                onChange={(e) => {
                  setChartType(e.target.value);
                  // Reset input type when changing chart type
                  if (e.target.value !== 'mindmap') {
                    setInputType('code');
                  }
                }}
                style={styles.select}
              >
                <option value="flowchart">📊 Flowchart</option>
                <option value="mindmap">🧠 Mindmap</option>
                <option value="diagram">📈 Sequence Diagram</option>
              </select>
            </div>

            {/* Input Type Toggle - Only show for mindmaps */}
            {chartType === 'mindmap' && (
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Input Type
                </label>
                <select
                  value={inputType}
                  onChange={(e) => setInputType(e.target.value)}
                  style={styles.select}
                >
                  <option value="code">💻 From Code</option>
                  <option value="prompt">💭 From Text/Idea</option>
                </select>
              </div>
            )}
            
            <div style={{ ...styles.formGroup, justifyContent: 'flex-end' }}>
              <button
                onClick={generateChart}
                disabled={loading || connectionStatus !== 'connected'}
                style={{
                  ...styles.button,
                  ...(loading || connectionStatus !== 'connected' ? styles.buttonDisabled : {}),
                  marginTop: '24px'
                }}
              >
                {loading ? '🤖 Generating...' : '✨ Generate Chart'}
              </button>
            </div>
          </div>
        </div>

        <div style={styles.contentGrid}>
          {/* Input Area - Code or Text based on selection */}
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>
              {chartType === 'mindmap' && inputType === 'prompt' ? '💭 Text Prompt' : '💻 Code Input'}
            </h2>
            {chartType === 'mindmap' && inputType === 'prompt' ? (
              <textarea
                value={textPrompt}
                onChange={(e) => setTextPrompt(e.target.value)}
                style={{...styles.textarea, fontFamily: 'Arial, sans-serif'}}
                placeholder="Enter any topic, idea, or question you want to explore as a mindmap..."
                spellCheck={true}
              />
            ) : (
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={styles.textarea}
                placeholder={`Enter your ${language} code here...`}
                spellCheck={false}
              />
            )}
          </div>

          {/* Chart Display */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>
                📊 Generated Chart
              </h2>
              {chartData && (
                <button
                  onClick={exportChart}
                  style={styles.exportButton}
                >
                  💾 Export SVG
                </button>
              )}
            </div>
            
            <div style={styles.chartArea}>
              {error && (
                <div style={styles.error}>
                  ❌ {error}
                </div>
              )}

              {success && (
                <div style={styles.success}>
                  {success}
                </div>
              )}
              
              {loading && (
                <div style={styles.loading}>
                  <div style={styles.spinner}></div>
                  <p>AI is analyzing and generating your chart...</p>
                </div>
              )}
              
              {chartData && !loading && (
                <div>
                  {chartType === 'mindmap' ? (
                    <div ref={mindmapRef}></div>
                  ) : (
                    <div ref={chartRef}></div>
                  )}
                </div>
              )}
              
              {!chartData && !loading && !error && (
                <div style={styles.placeholder}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                  <p>Use the Universal AI Generator above, or enter code and click "Generate Chart" to see the magic!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Updated Instructions */}
        <div style={styles.instructions}>
          <h3 style={styles.instructionsTitle}>
            🚀 How to Use
          </h3>
          <div style={styles.instructionsGrid}>
            <div style={styles.instructionItem}>
              <strong>1. Universal AI Generator</strong>
              <p>🌟 NEW! Enter any text and let AI automatically choose and create the best chart type for you!</p>
            </div>
            <div style={styles.instructionItem}>
              <strong>2. Traditional Code Charts</strong>
              <p>Paste your code and select specific chart types like flowcharts or mindmaps.</p>
            </div>
            <div style={styles.instructionItem}>
              <strong>3. Export & Share</strong>
              <p>Generate your charts and export them as SVG files for presentations or documentation.</p>
            </div>
          </div>
          <div style={{marginTop: '24px', color: '#004085', fontWeight: 'bold', fontSize: '16px', textAlign: 'center'}}>
            ⚠️ <span>Please refresh the page after submitting a prompt to ensure the latest chart is displayed.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;