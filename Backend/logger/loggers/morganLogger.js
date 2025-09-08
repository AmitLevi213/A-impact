import chalk from "chalk"; // Use default import for chalk
import morgan from "morgan";
import currentTime from "../../utils/timeService.js";

const morganLogger = morgan((tokens, req, res) => {
  const { year, month, day, hours, minutes, seconds } = currentTime();
  const currentDate = `[${year}/${month}/${day} ${hours}:${minutes}:${seconds}]`;

  if (tokens.status(req, res) >= 400)
    return chalk.redBright(
      [
        currentDate,
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        "-",
        tokens["response-time"](req, res),
        "ms",
      ].join(" ")
    );
  return chalk.cyanBright(
    [
      currentDate,
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ")
  );
});

export default morganLogger; // Use ES module export
