module.exports = ({file, options, env}) => {
  const isProduction = env === 'production';

  const postcssImportConfig = Object.assign({root: file.dirname}, options.import);
  const postcssUrlConfig = Object.assign({}, options.url);
  const cssnanoConfig = Object.assign({preset: 'default'}, options.cssnano);
  const cssnextConfig = Object.assign({features: {autoprefixer: false}}, options.cssnano);

  return {
    parser: file.extname === '.sss' ? 'sugarss' : false,
    plugins: {
      'postcss-import': postcssImportConfig,
      'postcss-url': postcssUrlConfig,
      'postcss-cssnext': isProduction ? cssnextConfig : false,
      cssnano: isProduction ? cssnanoConfig : false
    }
  };
};
