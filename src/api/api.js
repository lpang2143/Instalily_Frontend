export const getAIMessage = async (userQuery) => {
  let responseData;

  const queryData = {
    query: userQuery
  }
  
  try {
    // console.log('here!')
    const response = await fetch('https://instalily-backend-46779b2cb5ab.herokuapp.com/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(queryData)
    });

    // console.log('got response')
    
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
    const message = {
      role: "assistant",
      content: "Sorry, I can't connect to the backend right now."
    }
    return message
  }
};
