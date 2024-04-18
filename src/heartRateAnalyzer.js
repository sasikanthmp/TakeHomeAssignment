var fs = require('fs');
function CalculateStats() {
    try {
        var inputData = JSON.parse(fs.readFileSync(`${__dirname}/heartrate.json`, 'utf8'));
        const dailyStats = {}
        inputData.forEach((data) => {
            const date = data?.timestamps?.startTime.split('T')[0];
            if(!dailyStats[date]) {
                const stats = {
                    date,
                    min: data?.beatsPerMinute,
                    max: data?.beatsPerMinute,
                    beatsPerMinute: [],
                    latestDataTimestamp: data?.timestamps?.startTime
                }
                dailyStats[date] = stats
            } else {
                dailyStats[date].beatsPerMinute.push(data?.beatsPerMinute); // Push beats per minute value
                dailyStats[date].min = Math.min(dailyStats[date].min, data?.beatsPerMinute);
                dailyStats[date].max = Math.max(dailyStats[date].max, data?.beatsPerMinute);
                dailyStats[date].latestDataTimestamp = data?.timestamps?.startTime;
            }
        })
        // Updated Logic for Calculating Median
        Object.values(dailyStats).forEach(stats => {
            const beatsPerMinute = stats.beatsPerMinute;
            beatsPerMinute.sort((a, b) => a - b);
            const length = beatsPerMinute.length;
            const mid = Math.floor(length / 2);
            if (length % 2 === 0) {
                stats.median = (beatsPerMinute[mid - 1] + beatsPerMinute[mid]) / 2;
            } else {
                stats.median = beatsPerMinute[mid];
            }
            delete stats.beatsPerMinute;
        });

        fs.writeFileSync('output.json', JSON.stringify(Object.values(dailyStats), null, 2));
    }
    catch (error) {
        console.error('An error occurred:', error);
    }}

CalculateStats()