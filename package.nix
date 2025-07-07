{ lib, buildNpmPackage, electron, makeWrapper }:

buildNpmPackage rec {
    pname = "perplexity-ai";
    version = "1.0.0";
    src = ./.;

    npmDepsHash = "sha256-V+7ZoIYOvP5vP9mSQsfl2HP21CCkEvMQDefLnc7YFR0=";

    dontNpmBuild = true;

    nativeBuildInputs = [
        electron
        makeWrapper
    ];

    env = {
        ELECTRON_SKIP_BINARY_DOWNLOAD = "1";
    };

    postInstall = ''
    makeWrapper ${electron}/bin/electron $out/bin/perplexity-ai --add-flags $out/lib/node_modules/perplexity-ai/index.js
    '';

    meta = with lib; {
        description = "Perplexity AI wrapper";
        homepage = "https://github.com/ShouxTech/perplexity-ai";
        license = licenses.mit;
        maintainers = with maintainers; [ CriShoux ];
        platforms = platforms.linux;
    };
}
