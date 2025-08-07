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

  export const formatFileSize = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

    /**
     * Infers the media type based on a file extension.
     * @param extension The file extension (e.g., 'jpg', 'mp4').
     * @returns The inferred media type: 'Image', 'Video', or 'Sound'.
     */
    export const inferMediaTypeFromExtension = (extension: string): 'Image' | 'Video' | 'Sound' => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'];
        const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
        const soundExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac'];

        const lowerCaseExt = extension.toLowerCase();

        if (imageExtensions.includes(lowerCaseExt)) {
            return 'Image';
        }
        if (videoExtensions.includes(lowerCaseExt)) {
            return 'Video';
        }
        if (soundExtensions.includes(lowerCaseExt)) {
            return 'Sound';
        }

        // Default to Image if the extension is unknown
        return 'Image';
    };