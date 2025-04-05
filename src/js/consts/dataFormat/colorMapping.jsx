/* global _ */

// Hard-coded color palette - no SCSS import
const COLORS = {
  state: {
    default: [
      '#c1e4ff', '#9ad0ff', '#72bcff', '#4aa8ff', '#2294ff',
      '#0080fd', '#0066ca', '#004d97', '#003364', '#001a32'
    ],
    light: [
      '#e6f3ff', '#cce7ff', '#b3dbff', '#99cfff', '#80c3ff'
    ],
    dark: [
      '#002142', '#001a36', '#00142b', '#000d1f', '#000714'
    ]
  },
  gyr: {
    default: ['#28a745', '#ffc107', '#dc3545'],
    light: ['#a3e9b7', '#ffe9a6', '#f6b3bc'],
    dark: ['#165c26', '#876600', '#741c24']
  },
  default: '#cccccc'
};

function getRandomColor(index = null, palette = "default") {
  try {
    const paletteArray = COLORS.state[palette] || COLORS.state.default;
    const paletteLength = paletteArray.length;

    if (paletteLength === 0) {
      return '#cccccc'; // Fallback color if palette is empty
    }

    if (index === null || index === undefined) {
      return paletteArray[_.random(0, paletteLength - 1)];
    }

    // index % length makes sure that index is in range
    return paletteArray[index % paletteLength];
  } catch (error) {
    console.warn("Error in getRandomColor:", error);
    return '#cccccc'; // Fallback color
  }
}

function getColorByName(name, palette = "default") {
  try {
    if (!name) return COLORS.default;

    if (name === "default") {
      return COLORS.default;
    }

    // Check for success, warning, error
    if (name.includes('success')) {
      return COLORS.gyr[palette]?.[0] || COLORS.gyr.default[0];
    }
    if (name.includes('warning')) {
      return COLORS.gyr[palette]?.[1] || COLORS.gyr.default[1];
    }
    if (name.includes('error')) {
      return COLORS.gyr[palette]?.[2] || COLORS.gyr.default[2];
    }

    // Check for stateX pattern
    const stateMatch = name.match(/state([0-9]+)/);
    if (stateMatch) {
      const stateIndex = parseInt(stateMatch[1], 10) - 1;
      const stateArray = COLORS.state[palette] || COLORS.state.default;
      if (stateIndex >= 0 && stateIndex < stateArray.length) {
        return stateArray[stateIndex];
      }
    }

    // If no match, return random color
    return getRandomColor(_.random(0, 8), palette);
  } catch (error) {
    console.warn("Error in getColorByName:", error);
    return '#cccccc'; // Fallback color
  }
}

function getColor(index, config, hover = false) {
  try {
    if (!config || !config.data) {
      return getRandomColor(index);
    }

    let palette = (config.palette && typeof config.palette === 'string') ? config.palette : "default";
    if (hover) {
      const palettes = ["default", "dark", "light"];
      const currentIndex = palettes.indexOf(palette);
      palette = palettes[(currentIndex >= 0 ? currentIndex : 0 + 1) % palettes.length];
    }

    if (config.data.colorsArray && Array.isArray(config.data.colorsArray) && config.data.colorsArray.length) {
      return getColorByName(config.data.colorsArray[index], palette);
    }
    if (config.data.color) {
      return getColorByName(config.data.color, palette);
    }
    return getRandomColor(index, palette);
  } catch (error) {
    console.warn("Error in getColor:", error);
    return '#cccccc'; // Fallback color
  }
}

function getArrayOfColors(length, config, hover = false) {
  try {
    const colorsArray = [];
    for (let index = 0; index < length; index += 1) {
      const color = getColor(index, config, hover);
      colorsArray.push(color);
    }
    return colorsArray;
  } catch (error) {
    console.warn("Error in getArrayOfColors:", error);
    return Array(length).fill('#cccccc'); // Fallback colors
  }
}

export { getArrayOfColors, getColor, getColorByName, getRandomColor };