<!--
  README with scrolling message over static contribution grid.
  - graph-container: holds the SVG grid and marquee overlay
  - marquee: scrolling text animation across the grid
  - tagline: small subtitle beneath the graph
  - icons: row of tech stack icons
-->

<style>
  .graph-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
    margin-top: 24px;
  }
  .graph-wrapper img {
    display: block;
    width: 100%;
    height: auto;
  }
  .marquee {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    transform: translateY(-50%);
    overflow: hidden;
    pointer-events: none;
    white-space: nowrap;
  }
  .marquee span {
    display: inline-block;
    padding-left: 100%;
    animation: scroll 15s linear infinite;
    color: #ffffff;
    font-size: 1.5rem;
    text-shadow: 0 0 4px #000;
  }
  @keyframes scroll {
    from { transform: translateX(0); }
    to { transform: translateX(-100%); }
  }
  .tagline {
    margin-top: 12px;
    text-align: center;
    font-size: 0.9rem;
    color: #ffffff;
    opacity: 0.8;
    animation: fade 2s ease-in;
  }
  @keyframes fade {
    from { opacity: 0; }
    to { opacity: 0.8; }
  }
  .icons {
    margin-top: 16px;
    text-align: center;
  }
  .icons img {
    width: 32px;
    height: 32px;
    margin: 0 8px;
    vertical-align: middle;
  }
</style>

<div class="graph-wrapper">
  <!-- Static contribution grid -->
  <img src="https://material-balanced-cocoa.glitch.me/svg" alt="Contribution Preview" />
  <!-- Scrolling message overlay -->
  <div class="marquee">
    <span>BUILD FUN THINGS BUILD FUN THINGS BUILD FUN THINGS </span>
  </div>
</div>

<!-- Small tagline under the graph -->
<div class="tagline">why are you here</div>

<!-- Row of tool icons -->
<div class="icons">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="JavaScript" />
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="TypeScript" />
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" alt="Python" />
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/figma/figma-original.svg" alt="Figma" />
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" alt="Node.js" />
</div>

