import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { motion, AnimatePresence, px } from 'framer-motion';

// --- API CONSTANT (NO CHANGES) ---
const API_BASE = 'https://ai-chart-generator-1.onrender.com/api/charts/';

// --- ICONS (NO CHANGES) ---
const Icons = {
  magicWand: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
  chart: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="M18.7 8a6 6 0 0 0-6 6h6a6 6 0 0 0-6-6Z"></path></svg>,
  download: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
  robot: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8v4Z"></path><path d="M8 8H4v4h4Z"></path><path d="M12 12v4h4v-4Z"></path><path d="M16 12h4v-4h-4Z"></path><rect width="18" height="18" x="3" y="3" rx="2"></rect></svg>,
};

// --- STYLES (ADJUSTED PER FEEDBACK) ---
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(-45deg, #130f40, #000000, #30336b, #130f40)',
    backgroundSize: '400% 400%',
    animation: 'gradient-animation 20s ease infinite',
    fontFamily: "'Inter', sans-serif",
    color: '#e0e0e0'
  },
  header: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(12px)',
    padding: '16px 24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '22px',
    fontWeight: '600',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#ffffff'
  },
  statusConnected: {
    backgroundColor: 'rgba(0, 255, 159, 0.1)',
    color: '#00ff9f',
    padding: '6px 12px',
    borderRadius: '9999px',
    fontSize: '13px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  statusDisconnected: {
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
    color: '#ff4757',
    padding: '6px 12px',
    borderRadius: '9999px',
    fontSize: '13px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px'
  },
  panel: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(12px)',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  controlPanel: {
    marginBottom: '32px',
  },
  controlGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    alignItems: 'flex-end',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '12px', // Increased spacing
    color: '#b0b0b0',
    padding:'10px',
  },
  select: {
    padding: '10px 14px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Changed background color
    color: '#f0f0f0',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
  },
  button: {
    background: 'linear-gradient(45deg, #00d2d3 0%, #54a0ff 100%)',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 15px rgba(0, 210, 211, 0.2)',
  },
  buttonDisabled: {
    background: 'rgba(255, 255, 255, 0.2)',
    cursor: 'not-allowed',
    boxShadow: 'none'
  },
  universalButton: {
    background: 'linear-gradient(45deg, #ff6b6b 0%, #5f27cd 100%)',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 20px 0 rgba(95, 39, 205, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '32px',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  panelTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  textarea: {
    width: '100%',
    flexGrow: 1,
    minHeight: '450px',
    padding: '16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    fontFamily: "'Fira Code', monospace",
    fontSize: '14px',
    resize: 'none',
    outline: 'none',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    color: '#d1d5db',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    marginTop:"20px",
  },
  universalTextarea: {
    width: '100%',
    minHeight: '160px',
    padding: '16px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    fontFamily: "'Inter', sans-serif",
    fontSize: '15px',
    color: 'white',
    resize: 'vertical',
    outline: 'none',
    transition: 'box-shadow 0.2s',
  },
  chartArea: {
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    flexGrow: 1,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column'
  },
  message: {
    padding: '12px 16px',
    margin: '16px',
    borderRadius: '8px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  error: {
    backgroundColor: 'rgba(255, 71, 87, 0.15)',
    border: '1px solid #ff4757',
    color: '#ff8a94',
  },
  success: {
    backgroundColor: 'rgba(0, 255, 159, 0.1)',
    border: '1px solid #00ff9f',
    color: '#7bffcf',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#b0b0b0'
  },
  spinner: {
    border: '4px solid rgba(255, 255, 255, 0.2)',
    borderTop: '4px solid #00d2d3',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px'
  },
  placeholder: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  exportButton: {
    backgroundColor: '#00b894',
    color: 'white',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'background-color 0.2s'
  },
  instructions: {
    marginTop: '32px',
  },
  instructionsTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#f0f0f0',
    marginBottom: '16px'
  },
  instructionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  instructionItem: {
    color: '#54a0ff',
    fontSize: '14px'
  },
  universalPanel: {
    marginBottom: '32px',
  },
  universalTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  universalSubtitle: {
    fontSize: '15px',
    opacity: 0.8,
    marginBottom: '16px'
  },
  detectedType: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '8px 14px',
    borderRadius: '9999px',
    fontSize: '13px',
    marginTop: '12px',
    display: 'inline-block',
    fontWeight: '500',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  }
};


// --- CSS INJECTION (NO CHANGES) ---
const globalStyle = document.createElement('style');
globalStyle.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
  select:disabled, button:disabled { opacity: 0.5; }
  textarea:focus, select:focus {
    border-color: #54a0ff;
    box-shadow: 0 0 0 3px rgba(84, 160, 255, 0.3);
  }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @keyframes gradient-animation {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;
document.head.appendChild(globalStyle);

// --- ANIMATION VARIANTS (NO CHANGES) ---
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } };
const chartAreaMessageVariants = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };

// --- ANIMATED TEXT COMPONENT (NO CHANGES) ---
const AnimatedLoadingText = () => {
    const text = "AI is analyzing and generating your chart...";
    const letters = Array.from(text);
    const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.025 } } };
    const child = { visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 10 } };

    return (
        <motion.p variants={container} initial="hidden" animate="visible" style={{ display: 'inline-block' }}>
            {letters.map((letter, index) => (
                <motion.span key={index} variants={child} style={{ display: 'inline-block' }}>
                    {letter === " " ? "\u00A0" : letter}
                </motion.span>
            ))}
        </motion.p>
    );
};


function App() {
  // --- STATE AND LOGIC (NO CHANGES) ---
  const [code, setCode] = useState(`function calculateSum(a, b) {\n  if (a < 0 || b < 0) {\n    console.log("Negative numbers not allowed");\n    return null;\n  }\n  \n  let result = a + b;\n  console.log("Sum calculated: " + result);\n  return result;\n}\n\nlet x = 5;\nlet y = 10;\nlet sum = calculateSum(x, y);`);
  const [textPrompt, setTextPrompt] = useState(`How to start a successful online business`);
  const [inputType, setInputType] = useState('code');
  const [universalInput, setUniversalInput] = useState('');
  const [showUniversal, setShowUniversal] = useState(true);
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

  useEffect(() => {
    checkConnection();
    mermaid.initialize({ startOnLoad: true, theme: 'dark', flowchart: { useMaxWidth: true, htmlLabels: true } });
  }, []);
  useEffect(() => { if (chartData?.mermaidCode) { renderMermaidChart(chartData.mermaidCode); } }, [chartData]);
  useEffect(() => { const handler = setTimeout(() => { if (universalInput.length > 20) { getSuggestions(); } else { setSuggestions([]); setDetectedType(''); } }, 500); return () => clearTimeout(handler); }, [universalInput]);

  const checkConnection = async () => { try { const response = await fetch(`${API_BASE}/test`); const data = await response.json(); setConnectionStatus(data.connected ? 'connected' : 'disconnected'); } catch (err) { setConnectionStatus('disconnected'); setError('Cannot connect to backend. Make sure the server is running.'); } };
  const getSuggestions = async () => { try { const response = await fetch(`${API_BASE}/suggest-type`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input: universalInput }) }); const data = await response.json(); if (data.success) { setDetectedType(data.detectedType); setSuggestions(data.suggestions); } } catch (error) { console.error('Suggestion error:', error); } };
  const generateUniversalChart = async () => { if (!universalInput.trim()) { setError('Please enter some text to generate a chart'); return; } setLoading(true); setError(null); setSuccess(null); setChartData(null); try { const response = await fetch(`${API_BASE}/universal`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input: universalInput.trim(), chartType: null, autoDetect: true }) }); const data = await response.json(); if (data.success) { setChartData(data); setChartType(data.chartType); if (data.fallback) { setError('Generated fallback chart - AI response could be improved'); } else { setSuccess(`Successfully generated ${data.chartType} chart! ${data.detectedType ? `(Auto-detected: ${data.detectedType})` : ''}`); } } else { setError(data.error || 'Failed to generate universal chart'); } } catch (error) { setError('Network error: ' + error.message); console.error('Universal chart generation error:', error); } finally { setLoading(false); } };
  const generateChart = async () => { if (chartType === 'mindmap' && inputType === 'text') { if (!textPrompt.trim()) { setError('Please enter a text prompt first!'); return; } } else { if (!code.trim()) { setError('Please enter some code first!'); return; } } setLoading(true); setError(null); setSuccess(null); setChartData(null); try { const endpoint = `${API_BASE}/${chartType}`; const requestBody = { language }; if (chartType === 'mindmap' && inputType === 'text') { requestBody.prompt = textPrompt; requestBody.inputType = 'text'; } else { requestBody.code = code; requestBody.inputType = 'code'; } const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) }); const data = await response.json(); if (data.success) { setChartData(data); setSuccess('Chart generated successfully!'); } else { setError(data.error || 'Failed to generate chart'); if (data.fallback) { setChartData({ chartType, mermaidCode: data.fallback }); } } } catch (err) { setError('Error generating chart: ' + err.message); console.error('Generation error:', err); } finally { setLoading(false); } };
  const renderMermaidChart = async (mermaidCode) => { if (!chartRef.current) return; try { chartRef.current.innerHTML = ''; const { svg } = await mermaid.render('chart-' + Date.now(), mermaidCode); chartRef.current.innerHTML = svg; } catch (err) { console.error('Mermaid render error:', err); chartRef.current.innerHTML = `<div style="color: #ff4757; padding: 16px;">Error rendering chart: ${err.message}<br><pre>${mermaidCode}</pre></div>`; } };
  const exportChart = () => { if (!chartRef.current) return; const svgElement = chartRef.current.querySelector('svg'); if (svgElement) { const svgData = new XMLSerializer().serializeToString(svgElement); const blob = new Blob([svgData], { type: 'image/svg+xml' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `chart-${chartData?.chartType || 'export'}-${Date.now()}.svg`; link.click(); URL.revokeObjectURL(url); } };

  return (
    <div style={styles.container}>
      <header style={styles.header}><div style={styles.headerContent}><h1 style={styles.title}>{Icons.robot} AI Chart Generator</h1><div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}><div style={connectionStatus === 'connected' ? styles.statusConnected : styles.statusDisconnected}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'currentColor' }}></div>{connectionStatus === 'connected' ? 'Groq Connected' : 'Disconnected'}</div></div></div></header>

      <motion.main style={styles.main} variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} style={{...styles.panel, ...styles.universalPanel}} whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}>
            <div style={styles.universalTitle}>✨ Smart AI Generator<button onClick={() => setShowUniversal(!showUniversal)} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer', marginLeft: 'auto' }}>{showUniversal ? 'Hide' : 'Show'}</button></div>
            <div style={styles.universalSubtitle}>Enter any text and let AI automatically choose the best chart for you.</div>
            <AnimatePresence>{showUniversal && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease: "easeInOut" }}>
                <textarea style={styles.universalTextarea} placeholder="Enter any text to visualize... Examples:&#10;• How to make a perfect cup of coffee&#10;• Evolution of smartphones 1990-2024&#10;• Customer service workflow" value={universalInput} onChange={(e) => setUniversalInput(e.target.value)}/>
                {detectedType && (<div style={styles.detectedType}>🎯 Auto-detected: <strong>{detectedType}</strong> content</div>)}
                <div style={{ marginTop: '16px' }}><motion.button onClick={generateUniversalChart} disabled={loading || !universalInput.trim() || connectionStatus !== 'connected'} style={{ ...styles.universalButton, ...((loading || !universalInput.trim() || connectionStatus !== 'connected') ? { background: 'rgba(255, 255, 255, 0.2)', boxShadow: 'none', cursor: 'not-allowed' } : {}) }} whileHover={{ scale: loading ? 1 : 1.05, y: -2 }} whileTap={{ scale: loading ? 1 : 0.95 }}>{Icons.magicWand} {loading ? 'Generating...' : 'Generate Smart Chart'}</motion.button></div>
            </motion.div>)}</AnimatePresence>
        </motion.div>

        <motion.div layout transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }} variants={itemVariants} style={{...styles.panel, ...styles.controlPanel}} whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}>
            <h3 style={{ margin: 0, marginBottom: '20px', fontWeight: '600', color: '#c0c0c0' }}>Manual Chart Generation</h3>
            <div style={styles.controlGrid} ><div style={styles.formGroup}><label style={styles.label}>Programming Language:                     </label><select value={language} onChange={(e) => setLanguage(e.target.value)} style={styles.select} disabled={chartType === 'mindmap' && inputType === 'text'}><option value="javascript">JavaScript</option><option value="python">Python</option><option value="java">Java</option><option value="cpp">C++</option><option value="csharp">C#</option></select></div><div style={styles.formGroup}><label style={styles.label}>Chart Type:             </label><select value={chartType} onChange={(e) => { setChartType(e.target.value); if (e.target.value !== 'mindmap') setInputType('code'); }} style={styles.select}><option value="flowchart">Flowchart</option><option value="mindmap">Mindmap</option></select></div>
            {chartType === 'mindmap' && (<div style={styles.formGroup}><label style={styles.label}>Input Type</label><select value={inputType} onChange={(e) => setInputType(e.target.value)} style={styles.select}><option value="code">From Code</option><option value="text">From Text/Idea</option></select></div>)}
            <div style={{ ...styles.formGroup, justifyContent: 'flex-end' }}><motion.button onClick={generateChart} disabled={loading || connectionStatus !== 'connected'} style={{ ...styles.button, ...(loading || connectionStatus !== 'connected' ? styles.buttonDisabled : {}) }} whileHover={{ scale: loading ? 1 : 1.05, y: -2 }} whileTap={{ scale: loading ? 1 : 0.95 }}>{Icons.chart} {loading ? 'Generating...' : 'Generate Chart'}</motion.button></div></div>
        </motion.div>

        <motion.div variants={itemVariants} style={styles.contentGrid}>
          <motion.div style={{...styles.panel, display: 'flex', flexDirection: 'column'}} whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}><h2 style={styles.panelTitle}>{chartType === 'mindmap' && inputType === 'text' ? '💭 Text Prompt' : '💻 Code Input'}</h2>{chartType === 'mindmap' && inputType === 'text' ? (<textarea value={textPrompt} onChange={(e) => setTextPrompt(e.target.value)} style={{...styles.textarea, fontFamily: "'Inter', sans-serif"}} placeholder="Enter any topic, idea, or question..." spellCheck={true} />) : (<textarea value={code} onChange={(e) => setCode(e.target.value)} style={styles.textarea} placeholder={`Enter your ${language} code here...`} spellCheck={false} />)}</motion.div>
          <motion.div style={{...styles.panel, display: 'flex', flexDirection: 'column'}} whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}>
              <div style={styles.panelHeader}>
                  <h2 style={styles.panelTitle}>📊 Generated Chart</h2>
                  {chartData && <motion.button whileHover={{scale: 1.05, y: -2}} whileTap={{scale: 0.95}} onClick={exportChart} style={styles.exportButton}>{Icons.download} Export SVG</motion.button>}
              </div>
              <div style={styles.chartArea}>
                  <AnimatePresence mode="wait">
                      {error && <motion.div key="error" variants={chartAreaMessageVariants} initial="initial" animate="animate" exit="exit" style={{...styles.message, ...styles.error}}>❌ {error}</motion.div>}
                      {success && <motion.div key="success" variants={chartAreaMessageVariants} initial="initial" animate="animate" exit="exit" style={{...styles.message, ...styles.success}}>✅ {success}</motion.div>}
                      {loading && (<motion.div key="loading" variants={chartAreaMessageVariants} initial="initial" animate="animate" exit="exit" style={styles.loading}><div style={styles.spinner}></div><AnimatedLoadingText /></motion.div>)}
                  </AnimatePresence>
                  
                  {/* MODIFIED PART FOR CENTERING */}
                  <div ref={chartRef} style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
                      <AnimatePresence>
                          {!chartData && !loading && (
                              <motion.div key="placeholder" variants={chartAreaMessageVariants} initial="initial" animate="animate" exit="exit" style={styles.placeholder}>
                                  <div style={{ fontSize: '48px', marginBottom: '16px', opacity: '0.5' }}>🎨</div>
                                  <p>Your generated chart will appear here.</p>
                              </motion.div>
                          )}
                      </AnimatePresence>
                  </div>
              </div>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} style={{...styles.panel, ...styles.instructions}} whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}>
            <h3 style={styles.instructionsTitle}>🚀 How to Use</h3><div style={styles.instructionsGrid}><div style={styles.instructionItem}><strong>1. Universal AI Generator</strong><p style={{ opacity: 0.8, marginTop: '4px', color: '#c0c0c0' }}>Enter any text and let AI automatically choose and create the best chart type for you.</p></div><div style={styles.instructionItem}><strong>2. Manual Generation</strong><p style={{ opacity: 0.8, marginTop: '4px', color: '#c0c0c0' }}>Paste your code, select a chart type, and generate a visualization of your code's structure.</p></div><div style={styles.instructionItem}><strong>3. Export & Share</strong><p style={{ opacity: 0.8, marginTop: '4px', color: '#c0c0c0' }}>Once generated, click "Export SVG" to save your chart for presentations or documentation.</p></div></div>
        </motion.div>
      </motion.main>
    </div>
  );
}

export default App;