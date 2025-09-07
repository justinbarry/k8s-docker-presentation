// Mermaid preprocessor for reveal-md
module.exports = (markdown, options) => {
  return new Promise((resolve, reject) => {
    // Replace ```mermaid blocks with div.mermaid
    const processedMarkdown = markdown.replace(
      /```mermaid\n([\s\S]*?)```/g,
      (match, content) => {
        return `<div class="mermaid">\n${content}</div>`;
      }
    );
    
    // Add Mermaid initialization script
    const mermaidInit = `
<script>
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
      secondBkg: '#3c3c3c'
    }
  });
</script>`;
    
    resolve(processedMarkdown + mermaidInit);
  });
};