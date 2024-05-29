{ pkgs ? import <nixpkgs> {} }:

let
  lib = import <nixpkgs/lib>;
  buildNodeJs = pkgs.callPackage <nixpkgs/pkgs/development/web/nodejs/nodejs.nix> {
    python = pkgs.python3;
  };

  nodejs = buildNodeJs {
    enableNpm = true;
    version = "18.17.1";
    sha256 = "8hXPA9DwDwesC2dMaBn4BMFULhbxUtoEmAAirsz15lo=";
  };

  # NPM_CONFIG_PREFIX = toString ./npm_config_prefix;

in pkgs.mkShell {
  packages = with pkgs; [
    python3
    deno
    nodejs
    nodePackages.npm
    nodePackages.typescript
  ];

  # inherit NPM_CONFIG_PREFIX;

  # shellHook = ''
    # export PATH="${NPM_CONFIG_PREFIX}/bin:$PATH"
  # '';
}
