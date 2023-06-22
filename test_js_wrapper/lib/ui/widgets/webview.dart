import 'dart:math';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:test_js_wrapper/ui/model/test_js_wrapper.dart';
import 'package:webview_flutter/webview_flutter.dart';

class WebViewHomeWidget extends StatefulWidget {
  const WebViewHomeWidget({super.key});

  @override
  State<WebViewHomeWidget> createState() => _WebViewWidgetState();
}

class _WebViewWidgetState extends State<WebViewHomeWidget> {
  late final WebViewController _controller;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController();
    _controller.setJavaScriptMode(JavaScriptMode.unrestricted);
    _controller
        .
        // loadRequest(Uri.parse(
        //    "http://172.18.9.98:8080/testEngineScripts/test.html?question_id=1451724&mode=question&pad=true",
        // ));
        loadFlutterAsset('assets/testEngineScripts/test.html');
    initJavaScriptChannels(_controller);
  }

  void initJavaScriptChannels(WebViewController controller) {
    controller
    

    // ..addJavaScriptChannel('onError', onMessageReceived: onMessageReceived)
    // ..addJavaScriptChannel('onFillerUpdated',
        // onMessageReceived: onMessageReceived)
    ..addJavaScriptChannel('getQuestionData', onMessageReceived: (message) {
      print('webviewdemo');
      if (message.message != null) {
        int? questionId = int.tryParse(message.message);
        print('$questionId');
        // if (questionId != null) {
        //   String questionData = getQuestionData(questionId);
        // }
      }
    });
    // ..addJavaScriptChannel('imageClicked',
    //     onMessageReceived: onMessageReceived)
    // ..addJavaScriptChannel('getMCQAnswerDataCallback',
    //     onMessageReceived: onMessageReceived)
    // ..addJavaScriptChannel('getFillerAnswerDataCallback',
    //     onMessageReceived: onMessageReceived)
    // ..addJavaScriptChannel('onData', onMessageReceived: onMessageReceived)
    // ..addJavaScriptChannel('solutionClicked',
    //     onMessageReceived: onMessageReceived)
    // ..addJavaScriptChannel(
    //   'notifyAnswerStatusChanged',
    //   onMessageReceived: (message) {
    //     bool status = message.message == 'true';
    //     notifyAnswerStatusChanged(status);
    //   },
    // )
    // ..addJavaScriptChannel(
    //   'notifySubjectiveSolutionView',
    //   onMessageReceived: (jsMessage) {
    //     safeTry(() {
    //       _logger.d('flutterExitQuiz - ${jsMessage.message}');
    //       widget.onQuizEnded();
    //     });
    //   },
    // )
    // ..addJavaScriptChannel(
    //   'scrollQuestionCard',
    //   onMessageReceived: (jsMessage) {
    //     safeTry(() {
    //       final data = jsonDecode(jsMessage.message);
    //       _logger.d('flutterDataCallback - $data');
    //       safeTry(() => dataCallBack(data));
    //     });
    //   },
    // )
    // ..addJavaScriptChannel('getHintsData',
    //     onMessageReceived: onMessageReceived)
    // ..addJavaScriptChannel('videoSolutionLinkClicked',
    //     onMessageReceived: onMessageReceived)
    // ..addJavaScriptChannel('notifyOptionSelected',
    //     onMessageReceived: onMessageReceived);
  }



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: WebViewWidget(controller: _controller),
    );
  }
}
