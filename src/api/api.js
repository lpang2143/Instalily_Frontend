export const getAIMessage = async (userQuery) => {
  let responseData;

  const queryData = {
    query: userQuery
  }
  
  try {
    const response = await fetch('/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(queryData)
    });
    
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
