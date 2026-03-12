export interface WeatherData {
  temp_c: number;
  condition: string;
  icon: string;
}

/**
 * Fetch current weather from weatherapi.com for a given location.
 * Location can be a city name, lat/lon, zip code, etc.
 */
export async function getWeather(location: string): Promise<WeatherData> {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("WEATHER_API_KEY is not set");
  }

  const url = `https://api.weatherapi.com/v1/current.json?key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(location)}&aqi=no`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Weather API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  const current = json.current;
  const condition: string = current.condition.text;

  return {
    temp_c: current.temp_c,
    condition,
    icon: conditionToEmoji(condition),
  };
}

function conditionToEmoji(condition: string): string {
  const c = condition.toLowerCase();
  if (c.includes("sunny") || c.includes("clear")) return "☀️";
  if (c.includes("partly cloudy")) return "⛅";
  if (c.includes("cloudy") || c.includes("overcast")) return "☁️";
  if (c.includes("rain") || c.includes("drizzle")) return "🌧️";
  if (c.includes("thunder")) return "⛈️";
  if (c.includes("snow") || c.includes("blizzard")) return "❄️";
  if (c.includes("fog") || c.includes("mist")) return "🌫️";
  if (c.includes("wind")) return "💨";
  return "🌤️";
}
