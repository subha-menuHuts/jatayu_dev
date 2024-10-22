import { Alert, Linking } from "react-native";

const onShouldStartLoadWithRequest = (request) => {
  console.log(request.url);
  if (
    !request.url ||
    request.url.startsWith("http") ||
    request.url.startsWith("/") ||
    request.url.startsWith("#") ||
    request.url.startsWith("javascript") ||
    request.url.startsWith("about:blank")
  ) {
    return true;
  }

  // blocked blobs
  if (request.url.startsWith("blob")) {
    Alert.alert("Link cannot be opened.");
    return false;
  }

  // list of schemas we will allow the webview
  // to open natively
  if (
    request.url.startsWith("tel:") ||
    request.url.startsWith("mailto:") ||
    request.url.startsWith("maps:") ||
    request.url.startsWith("geo:") ||
    request.url.startsWith("sms:")
  ) {
    Linking.openURL(request.url).catch((er) => {
      Alert.alert("Failed to open Link: " + er.message);
    });
    return false;
  }

  // let everything else to the webview
  return true;
};

export default onShouldStartLoadWithRequest;
