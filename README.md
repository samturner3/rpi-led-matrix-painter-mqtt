## This software is still under construction 🚧

# Aim

The aim of this software is to run on rpi led message signs and to connect to an MQTT broker to receive instructions from ie. home assistant.

It will be sign agnostic, all the main functions should be agnostic and individual signs setup via a settings file.

# rpi-led-matrix-painter-mqtt

It uses [wesleytabaka/rpi-led-matrix-painter](https://github.com/wesleytabaka/rpi-led-matrix-painter) as a base, and introduces the MQTT connection, updating, and page functions.

# Contribution

I would gladly like suggestions on features and funconality as I build this.

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



# Wildcards

These are the wildcards I have decided to define for text and date/time replacement.
For example the MQTT message being sent to this sign may say `Hello, the time is now @@HH:mm@@`. The praser used is [date-fns](https://date-fns.org/), [so check what format to use here](https://date-fns.org/v2.30.0/docs/format).

`$$TextToBeReplaced$$`

`@@this text will pe passed to date time parser@@`
