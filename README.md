# rpi-led-matrix-painter-mqtt

Example use of wesleytabaka/rpi-led-matrix-painter

# Installation/setup

Assuming you have installed node, npm, and typescript (globally, for tsc functionality) on your Raspberry Pi...

1. Clone this repo

2. Install npm dependencies

```bash
npm install
```

3. Build the package

```bash
npm run build
```

4. Run the package

```bash
sudo npm run go
```

# Aim

The aim of this software is to run on rpi led message signs and to connect to an MQTT broker to receive instructions from.

It will be sign agnostic, all the main functions should be agnostic and individual signs setup via a settings file.
