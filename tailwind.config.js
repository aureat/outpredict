module.exports = {
    content: [
      "./public/index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
      "./node_modules/flowbite/**/*.js"
    ],
    theme: {
      fontFamily: {
        'sans': ['Avenir', 'Helvetica', 'Arial', 'sans-serif']
      },
      extend: {
        backgroundColor: {
          transparent: 'transparent',
          black: '#000',
          white: '#fff',
          gray: {
            600: '#3c3d41',
            700: '#37373b',
            800: '#303134',
            900: '#202124',
          },
          cornflower: {
            300: '#6a89ff'
          },
        },
      }
    },
    darkMode: 'class',
    plugins: [require('flowbite/plugin')],
  };
  