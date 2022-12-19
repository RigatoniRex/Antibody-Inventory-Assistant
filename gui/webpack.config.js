import WebpackShellPlugin from 'webpack-shell-plugin';

class myplugin {
    apply(compiler) {
        compiler.hooks.copmile.tap('MyPlugin_compile', () => {
            console.log('This code is executed before the compilation begins.');
        });
    }
}

//Executes the shell plugin before
export default config = {
    plugins: [
        new WebpackShellPlugin({
            onBuildStart: ['echo "Webpack Start" && npm run buildLib']
        }),
        new myplugin()
    ]
};
