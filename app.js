'use strict';

const Homey = require('homey');
const miio = require("miio");
const MiHub = require("./lib/MiHub");

class XiaomiMiioApp extends Homey.App {

  async onInit() {
    this.log("Initializing Xiaomi Mi Home app ...");

    this.homey.setTimeout(() => {
      const browser = miio.browse({ cacheTime: 10  }); // little trick in an attempt to avoid command caching
      browser.on('available', device => {
        this.log('Discovered device on '+ device.address +' with device id '+ device.id);
      });
    }, 2000);

    // INITIALIZE GATEWAY MODULE
    this.mihub = new MiHub({log: this.log, homey: this.homey});
    this.onSettingsChanged = this.onSettingsChanged.bind(this);
    this.homey.settings.on('set', this.onSettingsChanged);
    this.homey.settings.on('unset', this.onSettingsChanged);

    // VACUUMS
    this.homey.flow.getActionCard('findVacuum')
      .registerRunListener(async (args) => {
        try {
          return await args.device.miio.find();
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('fanPowerVacuum')
      .registerRunListener(async (args) => {
        try {
          await args.device.miio.changeFanSpeed(Number(args.fanspeed));
          return await args.device.setStoreValue("fanspeed", args.fanspeed);
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('vacuumRoborockFanspeed')
      .registerRunListener(async (args) => {
        try {
          await args.device.miio.changeFanSpeed(Number(args.fanspeed));
          return await args.device.setStoreValue("fanspeed", args.fanspeed);
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('vacuumRoborockMopIntensity')
      .registerRunListener(async (args) => {
        try {
          return await args.device.miio.setWaterBoxMode(Number(args.intensity));
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('goToTargetVacuum')
      .registerRunListener(async (args) => {
        try {
          return await args.device.miio.sendToLocation(args.xcoordinate, args.ycoordinate);
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('cleanZoneVacuum')
      .registerRunListener(async (args) => {
        try {
          const zones = JSON.parse("[" + args.zones + "]");
          return await args.device.miio.cleanZones(zones);
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('vacuumRoomCleaning')
      .registerRunListener(async (args) => {
        try {
          const rooms = JSON.parse("[" + args.rooms + "]");
          return await args.device.miio.cleanRooms(rooms);
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('modeVacuumMop')
      .registerRunListener(async (args) => {
        try {
          return await args.device.triggerCapabilityListener('vacuum_mop_mode', Number(args.mode));
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    // DMAKER FAN
    this.homey.flow.getActionCard('modeDmakerFan')
      .registerRunListener(async (args) => {
        try {
          await args.device.miio.changeMode(args.mode);
          return await args.device.setStoreValue("mode", args.mode);
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    // DMAKER FAN & ZHIMI
    this.homey.flow.getActionCard('changeSpeed')
      .registerRunListener(async (args) => {
        try {
          await args.device.miio.changeSpeed(args.speed);
          return await args.device.setStoreValue("speed", args.speed);
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('enableAngle')
      .registerRunListener(async (args) => {
        try {
          await args.device.miio.enableAngle(args.angle);
          const angle = args.angle === 'on' ? true : false;
          return await args.device.setStoreValue("angle_enable", angle);
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('setAngle')
      .registerRunListener(async (args) => {
        try {
          await args.device.miio.changeAngle(Number(args.angle));
          return await args.device.setStoreValue("angle", Number(args.angle));
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('enableChildLock')
      .registerRunListener(async (args) => {
        try {
          await args.device.miio.changeChildLock(args.childlock);
          const child_lock = args.childlock === 'on' ? true : false;
          return await args.device.setStoreValue("child_lock", child_lock);
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    // AIR PURIFIER
    this.homey.flow.getActionCard('modeAirpurifier')
      .registerRunListener(async (args) => {
        try {
          return await args.device.triggerCapabilityListener('airpurifier_mode', args.mode);
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('airpurifierSetFavorite')
      .registerRunListener(async (args) => {
        try {
          return await args.device.miio.setFavoriteLevel(Number(args.favorite));
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('modeAirpurifierZhimiMB4')
      .registerRunListener(async (args) => {
        try {
          return await args.device.triggerCapabilityListener('airpurifier_zhimi_airpurifier_mb4_mode', Number(args.mode));
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('modeAirpurifierZhimi')
      .registerRunListener(async (args) => {
        try {
          return await args.device.triggerCapabilityListener('airpurifier_zhimi_airpurifier_mode', args.mode);
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('modeAirpurifierZhimiMB3')
      .registerRunListener(async (args) => {
        try {
          return await args.device.triggerCapabilityListener('airpurifier_zhimi_airpurifier_mb3_mode', Number(args.mode));
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    // AIR PURIFIER, HUMIDIFIER
    this.homey.flow.getActionCard('modeHumidifier')
      .registerRunListener(async (args) => {
        try {
          await args.device.miio.mode(args.mode);
          return await args.device.setStoreValue("mode", args.mode);
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('modeHumidifier2')
      .registerRunListener(async (args) => {
        try {
          return await args.device.triggerCapabilityListener('humidifier2_mode', args.mode);
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('modeHumidifierCA4')
      .registerRunListener(async (args) => {
        try {
          return await args.device.triggerCapabilityListener('humidifier_ca4_mode', Number(args.mode));
        } catch (error) {
          return Promise.reject(error.message);
        }
      });
    
    this.homey.flow.getActionCard('modeHumidifierDeerma')
      .registerRunListener(async (args) => {
        try {
          return await args.device.triggerCapabilityListener('humidifier_deerma_jsq_mode', args.mode);
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('modeHumidifierDeermaJSQ4')
      .registerRunListener(async (args) => {
        try {
          return await args.device.triggerCapabilityListener('humidifier_deerma_jsq4_mode', Number(args.mode));
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('modeHumidifierDeermaJSQ5')
      .registerRunListener(async (args) => {
        try {
          return await args.device.triggerCapabilityListener('humidifier_deerma_jsq5_fanlevel', Number(args.mode));
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('modeHumidifierLeshowJSQ1')
      .registerRunListener(async (args) => {
        try {
          return await args.device.triggerCapabilityListener('humidifier_leshow_jsq1_mode', Number(args.mode));
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    // AIR PURIFIER, ZHIMI FAN
    this.homey.flow.getActionCard('ledAirpurifierHumidifier')
      .registerRunListener(async (args) => {
        try {
          if (args.device.hasCapability('airpurifier_mode')) {
            return await args.device.miio.call('set_led', [args.brightness === "3" ? "off" : "on"], { retries: 1 });
          } else {
            return await args.device.miio.call('set_led_b', [Number(args.brightness)], { retries: 1 });
          }          
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    // FANS
    this.homey.flow.getActionCard('modeDmakerFan1C')
      .registerRunListener(async (args) => {
        try {
          return await args.device.triggerCapabilityListener('dmaker_fan_1c_mode', Number(args.mode));
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('modeZhimiFanZA5')
      .registerRunListener(async (args) => {
        try {
          return await args.device.triggerCapabilityListener('zhimi_fan_za5_mode', Number(args.mode));
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    // PHILIPS EYECARE
    this.homey.flow.getActionCard('enableEyecare')
      .registerRunListener(async (args) => {
        try {
          const eyecare = args.eyecare == "on" ? true : false;
          return await args.device.triggerCapabilityListener('onoff.eyecare', eyecare);
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('modeEyecare')
      .registerRunListener(async (args) => {
        try {
          await args.device.miio.mode(args.mode);
          return await args.device.setStoreValue("mode", args.mode);
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    /* aqara-ctrl-ln2 & aqara-ctrl-neutral2 */
    this.homey.flow.getConditionCard('rightSwitch')
      .registerRunListener(async (args) => {
        if (args.device) {
          return args.device.getCapabilityValue("onoff.1");
        } else {
          return false;
        }
      })

    this.homey.flow.getActionCard('rightSwitchOn')
      .registerRunListener(async (args) => {
        try {
          return await this.mihub.sendWrite(args.device.data.sid, { channel_1: "on" });
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('rightSwitchOff')
      .registerRunListener(async (args) => {
        try {
          return await this.mihub.sendWrite(args.device.data.sid, { channel_1: "off" });
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('rightSwitchToggle')
      .registerRunListener(async (args) => {
        try {
          return await this.mihub.sendWrite(args.device.data.sid, { channel_1: "toggle" });
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    /* Mi / Aqara Humidity & Temperature sensor */
    this.homey.flow.getConditionCard('measure_humidity_between')
      .registerRunListener(async (args) => {
        if (args.device) {
          let value1, value2;
          if (args.value1 < args.value2) {
            value1 = args.value1;
            value2 = args.value2;
          } else {
            value1 = args.value2;
            value2 = args.value1;
          }
          return await args.device.getCapabilityValue('measure_humidity') >= value1 && args.device.getCapabilityValue('measure_humidity') <= value2;
        } else {
          return false;
        }
      })

    this.homey.flow.getConditionCard('measure_temperature_between')
      .registerRunListener(async (args) => {
        if (args.device) {
          let value1, value2;
          if (args.value1 < args.value2) {
            value1 = args.value1;
            value2 = args.value2;
          } else {
            value1 = args.value2;
            value2 = args.value1;
          }
          return await args.device.getCapabilityValue('measure_temperature') >= value1 && args.device.getCapabilityValue('measure_temperature') <= value2;
        } else {
          return false;
        }
      })

    // GATEWAY
    this.homey.flow.getActionCard('gateway_play_radio')
      .registerRunListener(async (args) => {
        try {
          const settings = args.device.getSettings();
          let volume = parseInt(args.volume * 100);
          let favoriteListsID = settings[`favorite${args.favoriteID}ID`];
          let favoriteListsIDArray = favoriteListsID.split(",");

          if (favoriteListsIDArray[0] !== undefined && favoriteListsIDArray[0] !== null && favoriteListsIDArray[1] !== undefined && favoriteListsIDArray[1] !== null) {
            let ids = favoriteListsIDArray[0];
            ids = ids.replace(/\s/g, "");
            let id = parseInt(ids);
            let urls = favoriteListsIDArray[1];
            urls = urls.replace(/\s/g, "");
            let url = urls.toString();

            await args.device.miio.call("play_specify_fm", { id: id, type: 0, url: url }, { retries: 1 });
            await args.device.miio.call("volume_ctrl_fm", [volume.toString()], { retries: 1 });

          }
          return Promise.resolve(true);
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('gateway_custom_radio')
      .registerRunListener(async (args) => {
        try {
          let volume = parseInt(args.volume * 100);
          await args.device.miio.call("play_specify_fm", { id: parseInt(args.id), type: 0, url: args.url }, { retries: 1 });
          await args.device.miio.call("volume_ctrl_fm", [volume.toString()], { retries: 1 });
          return Promise.resolve(true);
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('gateway_play_effect')
      .registerRunListener(async (args) => {
        try {
          return await args.device.miio.call("welcome", [parseInt(args.toneID)], { retries: 1 });
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

    this.homey.flow.getActionCard('gateway_set_volume')
      .registerRunListener(async (args) => {
        try {
          let volume = parseInt(args.volume * 100);
          switch (args.target) {
            case "alarm":
              return await args.device.miio.call("set_alarming_volume", [volume], { retries: 1 });
            case "doorbell":
              return await args.device.miio.call("set_doorbell_volume", [volume], { retries: 1 });
            case "prompt":
              return await args.device.miio.call("set_gateway_volume", [volume], { retries: 1 });
            case "radio":
              return await args.device.miio.call("volume_ctrl_fm", [volume.toString()], { retries: 1 });
          }
          return Promise.resolve(true);
        } catch (error) {
          return Promise.reject(error);
        }
      });

    // REMOTE
    this.homey.flow.getActionCard('remote_send_ir_code')
      .registerRunListener(async (args) => {
        try {
          return await args.device.sendIrCode(args.code);
        } catch (error) {
          return Promise.reject(error.message);
        }
      });

  }

  /* update settings (gatewaysList) */
  async onSettingsChanged(key) {
    switch (key) {
      case "gatewaysList":
        this.mihub.updateGateways(this.homey.settings.get("gatewaysList"));
        break;
      default:
        break;
    }
  }

  /* generate a gateway developer key */
  async generate(args) {
    try {
      const key = await this.generateKey();
      const device = await miio.device({ address: args.ip, token: args.token });
      const info = await device.call("miIO.info");
      const returnKey = await device.call("set_lumi_dpf_aes_key", [key]); 
      return Promise.resolve({ status: "OK", mac: info.mac.replace(/\:/g, "").toLowerCase(), password: key });
    } catch (error) {
      this.error(error);
      return Promise.reject(error);
    }
  }

  /* helper for generating a key */
  async generateKey() {
    const chars = "0123456789ABCDEF";
    let result = "";
    for (let i = 0; i < 16; i++) {
      let idx = Math.floor(Math.random() * chars.length);
      result += chars[idx];
    }
    return result;
  }

  /* test the connection to a device */
  async testConnection(args) {
    try {
      const device = await miio.device({ address: args.ip, token: args.token });
      const info = await device.call("miIO.info");
      return Promise.resolve({status: "OK", info});
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /* return the gateways */
  async getGateways() {
    return Promise.resolve(this.mihub.gateways);
  }

}

module.exports = XiaomiMiioApp;