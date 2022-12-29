; (function ($, window, document, undefined) {
  window.method2 = null;

  function hexToString(hex) {
    if (!hex.match(/^[0-9a-fA-F]+$/)) {
      throw new Error('is not a hex string.');
    }
    if (hex.length % 2 !== 0) {
      hex = '0' + hex;
    }
    var bytes = [];
    for (var n = 0; n < hex.length; n += 2) {
      var code = parseInt(hex.substr(n, 2), 16)
      bytes.push(code);
    }
    return bytes;
  }

  $(document).ready(function () {
    var input2 = $('#input2');
    var output = $('#output2');
    var checkbox = $('#auto-update2');
    var dropzone = $('#droppable-zone2');
    var option = $('[data-option]');
    var inputType = $('#input-type');

    var execute2 = function () {
      try {
        var type = 'text';
        var val = input2.val();
        if (inputType.length) {
          type = inputType.val();
        }
        if (type === 'hex') {
          val = hexToString(val);
        }
        output.val(method2(val, option.val()));
      } catch (e) {
        output.val(e);
      }
    }

    function autoUpdate() {
      if (!checkbox[0].checked) {
        return;
      }
      execute2();
    }

    if (checkbox.length > 0) {
      input2.bind('input propertychange', autoUpdate);
      inputType.bind('input propertychange', autoUpdate);
      option.bind('input propertychange', autoUpdate);
      checkbox.click(autoUpdate);
    }

    if (dropzone.length > 0) {
      var dropzonetext = $('#droppable-zone-text');

      $(document.body).bind('dragover drop', function (e) {
        e.preventDefault();
        return false;
      });

      if (!window.FileReader) {
        dropzonetext.text('Your browser does not support.');
        $('input2').attr('disabled', true);
        return;
      }

      dropzone.bind('dragover', function () {
        dropzone.addClass('hover');
      });

      dropzone.bind('dragleave', function () {
        dropzone.removeClass('hover');
      });

      dropzone.bind('drop', function (e) {
        dropzone.removeClass('hover');
        file = e.originalEvent.dataTransfer.files[0];
        dropzonetext.text(file.name);
        autoUpdate();
      });

      input2.bind('change', function () {
        file = input2[0].files[0];
        dropzonetext.text(file.name);
        autoUpdate();
      });

      var file;
      execute2 = function () {
        var startIndex = 0
        if (file.size > 1024) { 
          startIndex = file.size - 1024 
        }
        console.log(file)
        var customFile = new File([file.slice(startIndex, file.size)], "");
        sha256(customFile, startIndex)
      };
    }

    function iterate(sha265, startIndexOnMainFile) {
      let end = startIndexOnMainFile
      if (end <= 0) { 
        return 
      }
      let start = end - 1024
      if (start < 0) { 
        start = 0 
      }
      // console.log(start + ' - ' + end + ' - ' + sha265 + ' - ' + fromHexString(sha265))
      var customFile = new File([file.slice(start, end), fromHexString(sha265)], "");
      sha256(customFile, start)
    }

    function sha256(file, startIndexOnMainFile) {
      // console.log(file)
      reader = new FileReader();
      if (method2.update) {
        var batch = 1024 * 1024 * 2;
        var total = file.size;
        var end = total
        var current = method2;
        reader.onload = function (event) {
          try {
            current = current.update(event.target.result);
            asyncUpdate();
          } catch (e) {
            output.val(e);
          }
        };
        var asyncUpdate = function () {
          if (end > 0) {
            var start = Math.min(end - batch, 0);
            reader.readAsArrayBuffer(file.slice(start, end));
            end = start;
          } else {
            output.val(current.hex() + ' - ' + startIndexOnMainFile);
            iterate(current.hex(), startIndexOnMainFile)
          }
        };
        asyncUpdate();
      } else {
        output.val('hashing...');
        reader.onload = function (event) {
          try {
            output.val(method2(event.target.result, value));
          } catch (e) {
            output.val(e);
          }
        };
        reader.readAsArrayBuffer(file);
      }
    }

    $('#execute2').click(execute2);

    var parts = location.pathname.split('/');
    $('a[href="' + parts[parts.length - 1] + '"]').addClass('active');
  });
})(jQuery, window, document);



// MARK: - Minitasks
const fromHexString = (hexString) =>
  Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
