{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };
  outputs = { self, nixpkgs }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-darwin"
      ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
    in
    {
      devShells = forAllSystems (system:
        let
          pkgs = import nixpkgs { inherit system; };
          
          # Create tsconfig.json with updated output configuration
          tsconfigFile = pkgs.writeText "tsconfig.json" ''
            {
              "compilerOptions": {
                "target": "ES2020",
                "lib": ["ES2020", "DOM"],
                "strict": true,
                "moduleResolution": "node",
                "esModuleInterop": true,
                "skipLibCheck": true,
                "forceConsistentCasingInFileNames": true,
                "outFile": "./static/js/main.js",
                "module": "amd"
              },
              "include": ["src/**/*"],
              "exclude": ["node_modules"]
            }
          '';
          
          # Updated build script that ensures static/js directory exists
          buildScript = pkgs.writeShellScriptBin "build" ''
            mkdir -p static/js
            ${pkgs.typescript}/bin/tsc -p tsconfig.json
          '';
          
          # Updated watch script
          watchScript = pkgs.writeShellScriptBin "watch" ''
            mkdir -p static/js
            ${pkgs.typescript}/bin/tsc -p tsconfig.json --watch
          '';
          
          
        in
        with pkgs; {
          default = mkShell {
            buildInputs = [
              typescript
	      zola
              buildScript
              watchScript
            ];
            shellHook = ''
              mkdir -p static/js
              cp ${tsconfigFile} tsconfig.json
            '';
          };
        }
      );
    };
}
