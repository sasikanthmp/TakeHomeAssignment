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
                    median: data?.beatsPerMinute,
                    latestDataTimestamp: data?.timestamps?.startTime
                }
                dailyStats[date] = stats
            } else {
                const min = Math.min(dailyStats[date].min, data?.beatsPerMinute)
                const max = Math.max(dailyStats[date].max, data?.beatsPerMinute)
                const median =  ((data?.beatsPerMinute+dailyStats[date]?.median)/2)
                dailyStats[date] = {...dailyStats[date], min,max, median,  latestDataTimestamp: data?.timestamps?.startTime}
            }
        })
        fs.writeFileSync('output.json', JSON.stringify(Object.values(dailyStats), null, 2));
    }
    catch (error) {
        console.error('An error occurred:', error);
    }}

CalculateStats()