export default async function GetCountryName(countryCode) {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data[0].name.common;
  } catch (error) {
    console.error('Error fetching country name:', error);
    return null;
  }
}
