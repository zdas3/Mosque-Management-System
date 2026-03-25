export async function getPrayerTimes() {
    try {
        const res = await fetch('http://api.aladhan.com/v1/timingsByCity?city=Calicut&country=India', {
            next: { revalidate: 3600 } // Cache for 1 hour to prevent rate limiting
        });
        if (res.ok) {
            const json = await res.json();
            return json.data.timings;
        }
    } catch (e) {
        console.error("Aladhan API Error", e);
    }
    return null;
}

export function formatTimeWithOffset(time24, offsetMinutes = 0) {
    if (!time24) return "";
    // Remove tz/extension if returned like '05:30 (IST)'
    const cleanTime = time24.split(' ')[0];
    let [hourStr, minuteStr] = cleanTime.split(":");
    let hour = parseInt(hourStr, 10);
    let minute = parseInt(minuteStr, 10);
    
    // Add offset
    minute += offsetMinutes;
    while (minute >= 60) {
        minute -= 60;
        hour += 1;
    }

    const ampm = hour >= 12 && hour < 24 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;
}
