const useClipboard = () => {
  const write = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data));
  };

  const get = async <T,>(): Promise<T> => {
    const textData = await navigator.clipboard.readText();
    return JSON.parse(textData) as T;
  };

  return {
    get,
    write,
  };
};

export default useClipboard;
