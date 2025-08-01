    export const formatTime = (time: string) => {
        // Split the time string into hours, minutes, seconds
        const [hours, minutes] = time.split(':');
        
        // Convert hours to number
        const hourNum = parseInt(hours, 10);
        
        // Determine AM or PM
        const period = hourNum >= 12 ? 'PM' : 'AM';
        
        // Convert to 12-hour format
        const twelveHour = hourNum % 12 || 12; // Handle midnight (0 becomes 12)
        
        // Format the time string (remove seconds and add period)
        return `${twelveHour}:${minutes} ${period}`;
    };

    export const formatDate = (date: Date | null) => {
        if (!date) return "";
        const formattedDate = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        });
        const day = date.getDate();
        const daySuffix =
        day % 10 === 1 && day !== 11
            ? "st"
            : day % 10 === 2 && day !== 12
            ? "nd"
            : day % 10 === 3 && day !== 13
            ? "rd"
            : "th";
        return formattedDate.replace(/\d+/, `${day}${daySuffix}`);
  };