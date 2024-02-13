export const getAIMessage = async (userQuery) => {
  let responseData;

  try {
    const response = await fetch('/query');
    
    if (!response.ok) {
      throw new Error('HTTP error! Status: ${response.status}');
    } else {
      responseData = await response.json();
      console.log(responseData)
      const message = {
        role: "assistant",
        content: responseData['answer']
      };

      return message;
    }
  } catch (error){
    console.error('Error fetching data:', error)
    return null
  }
};
