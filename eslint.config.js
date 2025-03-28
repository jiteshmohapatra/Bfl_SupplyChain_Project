module.exports = [
    {
        files: ["src/js/**/*.{js,jsx}"],
        languageOptions: {
            parser: require("@babel/eslint-parser"),
            parserOptions: {
                requireConfigFile: false,
                babelOptions: {
                    presets: ["@babel/preset-react"],
                },
            },
        },
        rules: {
            "no-unused-vars": "warn", // Adjust as needed
        },
    },
];