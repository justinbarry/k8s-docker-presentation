// Custom JavaScript for K8s presentation

// Initialize Mermaid for diagram rendering
if (typeof mermaid !== 'undefined') {
  mermaid.initialize({
    startOnLoad: true,
    theme: 'dark',
    themeVariables: {
      primaryColor: '#42a5f5',
      primaryTextColor: '#fff',
      primaryBorderColor: '#1976d2',
      lineColor: '#90caf9',
      secondaryColor: '#64b5f6',
      tertiaryColor: '#2196f3',
      background: '#1a1a1a',
      mainBkg: '#2c2c2c',
      secondBkg: '#3c3c3c',
      tertiaryBkg: '#4c4c4c',
      primaryBorderColor: '#42a5f5',
      secondaryBorderColor: '#64b5f6',
      tertiaryBorderColor: '#90caf9',
      fontFamily: '"Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontSize: '16px',
      labelBackground: '#2c2c2c',
      textColor: '#ffffff',
      nodeBkg: '#2c2c2c',
      nodeBorder: '#42a5f5',
      clusterBkg: '#3c3c3c',
      clusterBorder: '#64b5f6',
      defaultLinkColor: '#90caf9',
      titleColor: '#ffffff',
      edgeLabelBackground: '#2c2c2c',
      actorBorder: '#42a5f5',
      actorBkg: '#2c2c2c',
      actorTextColor: '#ffffff',
      actorLineColor: '#90caf9',
      signalColor: '#ffffff',
      signalTextColor: '#ffffff',
      labelBoxBkgColor: '#2c2c2c',
      labelBoxBorderColor: '#42a5f5',
      labelTextColor: '#ffffff',
      loopTextColor: '#ffffff',
      noteBorderColor: '#42a5f5',
      noteBkgColor: '#3c3c3c',
      noteTextColor: '#ffffff',
      activationBorderColor: '#90caf9',
      activationBkgColor: '#3c3c3c',
      sequenceNumberColor: '#ffffff'
    },
    flowchart: {
      htmlLabels: true,
      curve: 'basis',
      padding: 20
    },
    sequence: {
      diagramMarginX: 50,
      diagramMarginY: 50,
      actorMargin: 100,
      width: 150,
      height: 65,
      boxMargin: 10,
      boxTextMargin: 5,
      noteMargin: 10,
      messageMargin: 35
    }
  });
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
  // Press 'O' for overview
  if (event.key === 'o' || event.key === 'O') {
    if (typeof Reveal !== 'undefined') {
      Reveal.toggleOverview();
    }
  }
  
  // Press 'S' for speaker notes
  if (event.key === 's' || event.key === 'S') {
    if (typeof Reveal !== 'undefined') {
      Reveal.showNotes();
    }
  }
  
  // Press 'F' for fullscreen
  if (event.key === 'f' || event.key === 'F') {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
});

// Add smooth scrolling for code blocks
document.addEventListener('DOMContentLoaded', function() {
  const codeBlocks = document.querySelectorAll('pre code');
  codeBlocks.forEach(block => {
    block.style.scrollBehavior = 'smooth';
  });
});

// Custom plugin for copy code button
if (typeof Reveal !== 'undefined') {
  Reveal.addEventListener('ready', function() {
    // Add copy button to code blocks
    const codeBlocks = document.querySelectorAll('pre');
    codeBlocks.forEach(block => {
      const button = document.createElement('button');
      button.className = 'copy-code-button';
      button.textContent = 'Copy';
      button.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        padding: 5px 10px;
        background: #42a5f5;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 12px;
        opacity: 0;
        transition: opacity 0.3s;
      `;
      
      block.style.position = 'relative';
      block.appendChild(button);
      
      block.addEventListener('mouseenter', () => {
        button.style.opacity = '1';
      });
      
      block.addEventListener('mouseleave', () => {
        button.style.opacity = '0';
      });
      
      button.addEventListener('click', () => {
        const code = block.querySelector('code');
        const text = code ? code.textContent : block.textContent;
        navigator.clipboard.writeText(text).then(() => {
          button.textContent = 'Copied!';
          setTimeout(() => {
            button.textContent = 'Copy';
          }, 2000);
        });
      });
    });
  });
}

// Log presentation start
console.log('Kubernetes for Docker Developers presentation loaded');
console.log('Press O for overview, S for speaker notes, F for fullscreen');