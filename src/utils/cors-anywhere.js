function doCORSRequest(options, callback, corsAPI) {
  const x = new XMLHttpRequest();
  x.open(options.method, corsAPI + options.url);
  x.onload = x.onerror = function () {
    callback({
      method: options.method,
      url: options.url,
      data: options.data,
      status: x.status,
      statusText: x.statusText,
      responseText: x.responseText || ""
    });
  };
  if (/^POST/i.test(options.method)) {
    x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  }
  x.send(options.data);
}

export default {
  install(app, options) {
    const corsAPI = options.corsAPI || ''
    app.config.globalProperties.$corsAnywhere = {
      GET: function(url, callback) {
        return doCORSRequest(
          {
            method: "GET",
            url: url,
            data: ""
          },
          callback,
          corsAPI
        );
      },
      POST: function({ url, data}, callback) {
        return doCORSRequest(
          {
            method: "POST",
            url: url,
            data: data
          },
          callback,
          corsAPI
        );
      },
      do: function({ method, url, data }, callback) {
        return doCORSRequest(
          {
            method: method,
            url: url,
            data: data
          },
          callback,
          corsAPI
        );
      },
    }
  }
}
