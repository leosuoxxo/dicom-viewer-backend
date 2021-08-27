


export const getOrganizations = async () => {

  const getData = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve('TTTTT'),100)
    })
  }
  
  const data = await getData();

  return data;
}