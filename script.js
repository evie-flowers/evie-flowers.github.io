document.addEventListener("DOMContentLoaded", function() {
  fetch("https://bing.biturl.top")
    .then(response => response.json())
    .then(data => {
      const imageUrl = data.url;
      const img = new Image();
      img.crossOrigin = "Anonymous"; // needed for colour extraction
      img.src = imageUrl;

      img.onload = function() {
        // image fade in when loaded
        const bg = document.getElementById("background");
        bg.style.backgroundImage = `url(${imageUrl})`;
        bg.style.opacity = 1;
        
        // use colorthief to get colours from the bg
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 5); 
        // e.g. [[r,g,b], [r,g,b], ...]

        // calculate brightness and pick the brightest color
        function getBrightness(r, g, b) {
          // Standard luminance formula
          return 0.299 * r + 0.587 * g + 0.114 * b;
        }
        let bestColor = palette[0];
        let maxBrightness = getBrightness(...bestColor);
        for (const c of palette) {
          const brightness = getBrightness(...c);
          if (brightness > maxBrightness) {
            maxBrightness = brightness;
            bestColor = c;
          }
        }

        // turn it into hex
        function rgbToHex(r, g, b) {
          return (
            "#" +
            [r, g, b]
              .map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? "0" + hex : hex;
              })
              .join("")
          );
        }
        const accentColor = rgbToHex(bestColor[0], bestColor[1], bestColor[2]);
        document.documentElement.style.setProperty('--accent-color', accentColor);

        // hover colour calculation
        function lightenColor(hex, percent) {
          hex = hex.replace(/^#/, '');
          let r = parseInt(hex.substring(0,2), 16);
          let g = parseInt(hex.substring(2,4), 16);
          let b = parseInt(hex.substring(4,6), 16);
          r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
          g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
          b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));
          return "#" + [r, g, b]
            .map(x => x.toString(16).padStart(2, '0'))
            .join('');
        }
        const accentHover = lightenColor(accentColor, 40); // control hover brightness
        document.documentElement.style.setProperty('--accent-hover', accentHover);

        // copyright footer
        if (data.copyright) {
          const footer = document.getElementById("footer");
          const match = data.copyright.match(/\(([^)]+)\)/);
          if (match && match[1]) {
            footer.innerText = "Background Photo: " + match[1];
          }
        }
      };
    })
    .catch(err => console.error("Error fetching Microsoft Image of the Day:", err));
});