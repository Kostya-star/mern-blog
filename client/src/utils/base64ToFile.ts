export const base64ToFile = (base64String: string) => {
  let file = null

  if(base64String) {
    const regex = /^data:(.+);base64,(.*)$/;
    const matches = base64String.match(regex);
    const contentType = matches?.[1];
    const base64Data = matches?.[2];
  
    // convert the base64 data to a Blob object
    const byteCharacters = atob(base64Data as string);
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }
    file = new Blob([new Uint8Array(byteArrays)], { type: contentType });
  }

  return file
};
