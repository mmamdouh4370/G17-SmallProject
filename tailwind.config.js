/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./js/**/*.js"
    
  ],
  theme: {
    extend: {
      colors: {
        'text': '#e5cdae',
        'alttext': '#f4efe9',
        'background': '#5b320e',
        'darkalt': '#8d5320',
        'primary': '#f2c582',
        'secondary': '#b07545',
        'accent': '#f2d3a1',
       },
    },
  },
  
  plugins: [],
}

