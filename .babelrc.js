const isTest = process.env.NODE_ENV === "test";

module.exports = {
  presets: [
    [
      "@babel/env",
      {
        modules: isTest ? "commonjs" : false
      }
    ],
    "@babel/react"
  ],
  plugins: [
    "@babel/proposal-object-rest-spread",
    "@babel/proposal-class-properties"
  ]
};
