# Kubernetes for Docker Developers - Presentation

A comprehensive, interactive presentation designed to help Docker developers transition to Kubernetes. Built with Reveal.js and reveal-md for a smooth presentation experience with live reload during development.

## Features

- 📊 **40+ slides** covering essential Kubernetes concepts
- 🎨 **Mermaid diagrams** for visual architecture comparisons
- 💻 **Syntax highlighting** for YAML, Bash, and JavaScript code
- 🎯 **Practical examples** with real-world scenarios
- 📝 **Speaker notes** for presenters
- 🌙 **Dark theme** optimized for technical presentations
- 📱 **Responsive design** works on all devices
- 🔄 **Live reload** during development

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A modern web browser

## Installation

1. Clone or download this repository:
```bash
cd k8s-docker-presentation
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Development Mode (Live Reload)

Start the presentation with live reload:
```bash
npm start
```

Open your browser at `http://localhost:1948`

Any changes to `slides.md` will automatically refresh the presentation.

### Build Static Files

Generate static HTML files for deployment:
```bash
npm run build
```

The static files will be in the `dist/` directory.

### Serve Static Files

After building, serve the static files:
```bash
npm run serve-static
```

Access at `http://localhost:8080`

### Export to PDF

Generate a PDF version of the presentation:
```bash
npm run pdf
```

This creates `slides.pdf` in the current directory.

**Note:** For best PDF results, you may need to install additional dependencies:
- On macOS: `brew install --cask chromium`
- On Linux: `apt-get install chromium-browser`

## Presentation Controls

- **Next slide:** Right Arrow / Space
- **Previous slide:** Left Arrow
- **Overview:** O key or ESC
- **Speaker notes:** S key
- **Fullscreen:** F key
- **Slide numbers:** Visible at bottom right
- **Progress bar:** Visible at bottom

## Content Structure

The presentation covers:

1. **Introduction** - Why Kubernetes matters for Docker users
2. **Core Concepts** - Translation between Docker and K8s terminology
3. **Local Development** - Setting up local Kubernetes environments
4. **Basic Resources** - Pods, Deployments, Services
5. **Configuration** - ConfigMaps, Secrets, Volumes
6. **Networking** - Services, Ingress, Load Balancing
7. **kubectl Commands** - Essential commands mapped to Docker equivalents
8. **Best Practices** - Production-ready patterns and anti-patterns
9. **Troubleshooting** - Common issues and solutions
10. **Development Workflow** - Tools and techniques for efficient development

## Customization

### Modifying Content

Edit `slides.md` to modify the presentation content. The file uses Markdown with special separators:
- `---` for horizontal slide separation
- `--` for vertical slide separation (not used in current presentation)

### Styling

- `custom.css` - Custom styles for the presentation
- `custom.js` - Custom JavaScript functionality
- `.reveal-md.json` - Reveal.js configuration

### Themes

To change the theme, edit `.reveal-md.json`:
```json
{
  "theme": "black",  // Change to: white, league, beige, sky, night, serif, simple, solarized
  "highlightTheme": "monokai"  // Change to: monokai, zenburn, vs, github, etc.
}
```

## Directory Structure

```
k8s-docker-presentation/
├── slides.md           # Main presentation content
├── custom.css          # Custom styling
├── custom.js           # Custom JavaScript
├── .reveal-md.json     # Reveal-md configuration
├── package.json        # Node.js dependencies
├── README.md          # This file
└── dist/              # Generated static files (after build)
```

## Tips for Presenters

1. **Practice Mode**: Use speaker notes (press S) to see additional context
2. **Time Management**: ~1-2 minutes per slide for a 45-60 minute presentation
3. **Interactive Elements**: Encourage questions at section breaks
4. **Live Demos**: Have a terminal ready for live kubectl demonstrations
5. **Backup**: Keep the PDF export as backup in case of technical issues

## 🚀 Public Deployment Options

### Option 1: GitHub Pages (Easiest)

1. **Create a GitHub repository**
   ```bash
   git add .
   git commit -m "Initial commit: K8s presentation for Docker developers"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/k8s-docker-presentation.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to Settings → Pages in your repository
   - Source: Deploy from a branch
   - Branch: Select `gh-pages` or use GitHub Actions
   - The presentation will be available at: `https://YOUR_USERNAME.github.io/k8s-docker-presentation/`

3. **Automatic Deployment** (Already configured!)
   - The `.github/workflows/deploy.yml` file is set up
   - Just push to main branch and it auto-deploys

### Option 2: Netlify (Best Performance)

1. **Deploy with Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify deploy --dir=dist --prod
   ```

2. **Or Connect GitHub Repository**
   - Go to [netlify.com](https://netlify.com)
   - "Import from Git" → Select your repo
   - Settings are pre-configured in `netlify.toml`
   - Auto-deploys on every push!

3. **Your URL**: `https://YOUR-SITE-NAME.netlify.app`

### Option 3: Vercel (Alternative)

1. **Deploy with Vercel CLI**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **Configuration**
   - Framework: Other
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Option 4: Surge.sh (Quickest)

```bash
npm install -g surge
npm run build
cd dist
surge
# Choose domain: YOUR-NAME.surge.sh
```

### Option 5: GitHub Gist + bl.ocks.org

1. Create a Gist with `standalone.html`
2. View at: `https://bl.ocks.org/YOUR_USERNAME/GIST_ID`

### Option 6: CodeSandbox/StackBlitz

1. Import the repository directly
2. Instant preview and sharing

### Docker Container

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 1948
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t k8s-presentation .
docker run -p 1948:1948 k8s-presentation
```

## Troubleshooting

### Port Already in Use
If port 1948 is in use, modify the port in `.reveal-md.json`:
```json
{
  "port": 3000
}
```

### Mermaid Diagrams Not Rendering
Ensure you have a stable internet connection as Mermaid is loaded from CDN. For offline use, download Mermaid and include it locally.

### PDF Export Issues
- Ensure Chromium is installed
- Try using `--print-size` option for custom sizes
- Check that no background processes are blocking the port

## Contributing

Feel free to submit issues and enhancement requests!

## Resources

- [Reveal.js Documentation](https://revealjs.com/)
- [reveal-md Documentation](https://github.com/webpro/reveal-md)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Documentation](https://docs.docker.com/)

## 🌐 Quick Public URL Options

### Instant Deployment (No Account Needed):
```bash
# Using npx serve (temporary URL)
npm run build
npx serve dist

# Using Python (for standalone.html)
python3 -m http.server 8000 --bind 0.0.0.0
# Then use ngrok or localtunnel for public URL
```

### Get a Public URL in 2 Minutes:
1. **localtunnel** (easiest, no signup):
   ```bash
   npm install -g localtunnel
   npm run build
   cd dist && python3 -m http.server 8080 &
   lt --port 8080 --subdomain k8s-docker-pres
   # URL: https://k8s-docker-pres.loca.lt
   ```

2. **ngrok** (more reliable):
   ```bash
   # Install from ngrok.com
   npm run build
   cd dist && python3 -m http.server 8080 &
   ngrok http 8080
   # Get URL from ngrok output
   ```

## 📦 Pre-built Files

The `dist/` folder contains ready-to-deploy static files. You can:
- Upload directly to any web hosting
- Serve with any static file server
- Deploy to CDN (CloudFlare Pages, AWS S3, etc.)

## License

MIT License - Feel free to use this presentation for your own workshops and training sessions.

## Acknowledgments

- Built with [Reveal.js](https://revealjs.com/) and [reveal-md](https://github.com/webpro/reveal-md)
- Mermaid diagrams powered by [Mermaid.js](https://mermaid-js.github.io/)
- Code highlighting by [Highlight.js](https://highlightjs.org/)