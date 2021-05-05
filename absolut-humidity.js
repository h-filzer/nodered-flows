var rhel = msg.payload.relative_humidity_7;
var tmp = msg.payload.temperature_2;
var pressure = msg.payload.barometric_pressure_6;
function calcAbsHumidity() {
  var pS = SattdampfDruckWasser(tmp);
  return Aufrunden(AbsFeuchte1(rhel, tmp, pressure, pS), 2);
}
function Sattdampftemperatur(pS) {
  var t = 100;
  var dt = 0.001;
  var safety = 1;
  do {
    safety++;
    var t0 = t - dt / 2;
    var t1 = t + dt / 2;
    var f0 = SattdampfDruckWasser(t0) - pS;
    var f1 = SattdampfDruckWasser(t1) - pS;
    var fS = (f1 - f0) / dt;
    t0 = t;
    t = t - f0 / fS;
  } while (Math.abs(t - t0) > dt || safety < 500);
  return t;
}
function SattdampfFunktion(x, p) {
  return (x * p) / (0.622 + x);
}
function AbsFeuchte1(rhel, temp, pressure, pS) {
  var phi = parseFloat(rhel);
  var t = parseFloat(temp);
  var p = parseFloat(pressure);
  p = p / 1000;
  phi = phi / 100;
  var a = (t + 273.15) * 287.1;
  var m = (p * 100000000) / a;
  var x1 = (0.622 * phi * pS * m) / (p - phi * pS);
  return x1;
}
function SattdampfDruckWasser(t) {
  var aq = 5.426651;
  var bq = -2005.1;
  var cq = 0.00013869;
  var dq = 0.000000000011965;
  var eq = -0.0044;
  var fq = -0.0057148;
  var kq = 293700;
  var ta = (t + 273.15) / 647.3;
  if (t >= -20 && t <= 374) {
    var te = t + 273.15;
    var x = te * te - kq;
    var y = 374.11 - t;
    var h1 = dq * x * x;
    var al =
      aq +
      bq / te +
      ((cq * x) / te) * (Math.pow(10, h1) - 1) +
      eq * Math.pow(10, fq * Math.pow(y, 1.25));
    h1 = Math.exp(-12 * Math.pow(ta, 4));
    var pS =
      1.01325 * Math.pow(10, al) +
      (ta - 0.422) * (0.577 - ta) * Math.exp(h1) * 0.00980665;
    return pS;
  } else return 0;
}
function Aufrunden(Wert, Stellen) {
  Stellen = parseInt(Stellen);
  var x = Math.pow(10, Stellen);
  var str = "" + Math.round(Wert * x) / x;
  return str;
}
var absolute_humidity = calcAbsHumidity();
