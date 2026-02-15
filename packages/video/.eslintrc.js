module.exports = {
  extends: "../../configs/.eslintrc.js",
  rules: {
    // https://github.com/pmndrs/react-three-fiber/discussions/2487
    "react/no-unknown-property": ["off", { ignore: ["JSX"] }],
  },
};
