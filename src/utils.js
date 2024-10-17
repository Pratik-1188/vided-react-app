export const getdomain = () => {
  if (
    window.location.host.includes("127.0.0.1") ||
    window.location.host.includes("localhost")
  )
    return "http://localhost:8080";
  else
    return "https://vided-spring-boot-app.internal.happysand-0cd6e089.centralindia.azurecontainerapps.io";
};
