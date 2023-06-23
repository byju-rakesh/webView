import 'dart:collection';
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:test_js_wrapper/ui/model/answer_proceesed_listner.dart';
import 'package:webview_flutter/webview_flutter.dart';

class TestJsWrapper extends StatefulWidget {
  final String mode;
  final String downloadFilePath;
  final String videoThumbnailBaseUrl;
  final double defaultQuestionId;
  int subjectStartColor = 0;
  int subjectEndColor = 0;
  final String subjectName;
  final String assessmentId;
  final OnAnswerProcessedListener? onAnswerProcessedListener;
  //final Map<int, QuestionModel> questionModelMap = LinkedHashMap<int, QuestionModel>();

  //final Map<int, QuestionAttemptModel> questionAttemptModelMap = LinkedHashMap<int, QuestionAttemptModel>();
  //final Map<int, int> positionMap = <int, int>{};

  final bool isStyleCustomized;
  final bool isInAdaptiveFlow;
  final bool isTopPaddingRequired;
  final bool isExtraBottomSpaceRequired;
  final bool disableSolutionInOptions;
  TestJsWrapper({
    super.key,
    required this.mode,
    this.subjectStartColor = 0,
    this.subjectEndColor = 0,
    required this.downloadFilePath,
    required this.videoThumbnailBaseUrl,
    required this.defaultQuestionId,
    required this.subjectName,
    required this.assessmentId,
    this.onAnswerProcessedListener,
    required this.isStyleCustomized,
    required this.isInAdaptiveFlow,
    required this.isTopPaddingRequired,
    required this.isExtraBottomSpaceRequired,
    required this.disableSolutionInOptions,
  });

  @override
  State<TestJsWrapper> createState() => _TestJsWrapperState();
}

class _TestJsWrapperState extends State<TestJsWrapper> {
  String MODE_SOLUTION = "solution";

  String MODE_VIEW_SOLUTION = "view_solution";

  String MODE_QUESTION = "question";

  String TEST_BASE_URL = "file:///android_asset/testEngineScripts";

  String CUSTOM_IMAGE_TAG = "tnl://";

  String IMAGE_FOLDER = "images/";

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

  //  String getQuestionData(int questionId) {
  Map<String, dynamic> doPrepareQuestionData(QuestionModel questionParser) {
    var jsonObj = <String, dynamic>{};

    jsonObj['type'] = questionParser.type;
    jsonObj['skills'] = ""; // getQuestionSkills(questionParser);

    //var passageModel = questionParser.passageModel;
    // if (passageModel != null && passageModel.passageBody.isNotEmpty) {
    //   jsonObj['passage'] = passageModel.passageBody;
    // } else if (questionParser.passageId > 0) {
    //   if (passage != null) {
    //     jsonObj['passage'] = passage.body();
    //   }
    // }

    jsonObj['title'] = questionParser.title;
    jsonObj['solution'] = questionParser.solution;

    var solutionVideoId = questionParser.solutionVideoId;
    if (solutionVideoId! > 0) {
      var videoThumbUrl = ""; // getVideoSolutionThumbnailUrl(solutionVideoId);

      var isSolutionVideoLocked = true;
      // if (onAnswerProcessedListener != null) {
      //   isSolutionVideoLocked = onAnswerProcessedListener.isSolutionVideoLocked(solutionVideoId);
      // }

      jsonObj['videoSolutionId'] = solutionVideoId;
      jsonObj['videoSolutionThumbnailUrl'] = videoThumbUrl;
      jsonObj['isSolutionVideoLocked'] = isSolutionVideoLocked;
    }

    var startColor = '#${widget.subjectStartColor.toRadixString(16)}';
    var endColor = '#${widget.subjectEndColor.toRadixString(16)}';
    if (!widget.isStyleCustomized) {
      startColor = '#000000';
      endColor = '#000000';
    }

    jsonObj['subject_color'] = endColor;
    jsonObj['isStyleCustomized'] = widget.isStyleCustomized;
    jsonObj['isTopPaddingRequired'] = widget.isTopPaddingRequired;
    // jsonObj['isTablet'] = ViewUtils.isTablet(webView.context);
    jsonObj['isExtraBottomSpaceRequired'] = widget.isExtraBottomSpaceRequired;
    jsonObj['disableSolutionInOptions'] = widget.disableSolutionInOptions;

    jsonObj['answers'] = ""; //prepareAnswerData(questionParser);

    return jsonObj;
  }

  void initJavaScriptChannels(WebViewController controller) {
    loadQuestionData();
    controller
      ..addJavaScriptChannel('onError', onMessageReceived: (message) {
        print('onError called $message');
      })
      ..addJavaScriptChannel('onFillerUpdated', onMessageReceived: (message) {
        print('onFillerUpdated called $message');
      })
      ..addJavaScriptChannel('getQuestionData', onMessageReceived: (message) {
        print('getQuestionData called $message');
      })
      ..addJavaScriptChannel('imageClicked', onMessageReceived: (message) {
        print('imageClicked called $message');
      })
      ..addJavaScriptChannel('getMCQAnswerDataCallback',
          onMessageReceived: (message) {
        print('getMCQAnswerDataCallback called $message');
      })
      ..addJavaScriptChannel('getFillerAnswerDataCallback',
          onMessageReceived: (message) {
        print('getFillerAnswerDataCallback called $message');
      })
      ..addJavaScriptChannel('onData', onMessageReceived: (message) {
        print('onData called $message');
      })
      ..addJavaScriptChannel('solutionClicked', onMessageReceived: (message) {
        print('solutionClicked called $message');
      })
      ..addJavaScriptChannel('notifyAnswerStatusChanged',
          onMessageReceived: (message) {
        print('notifyAnswerStatusChanged called $message');
      })
      ..addJavaScriptChannel('notifySubjectiveSolutionView',
          onMessageReceived: (message) {
        print('notifySubjectiveSolutionView called $message');
      })
      ..addJavaScriptChannel('scrollQuestionCard',
          onMessageReceived: (message) {
        print('scrollQuestionCard called $message');
      })
      ..addJavaScriptChannel('getHintsData', onMessageReceived: (message) {
        print('getHintsData called $message');
      })
      ..addJavaScriptChannel('videoSolutionLinkClicked',
          onMessageReceived: (message) {
        print('videoSolutionLinkClicked called $message');
      })
      ..addJavaScriptChannel('notifyOptionSelected',
          onMessageReceived: (message) {
        print('notifyOptionSelected called $message');
      });
  }

  Future<void> loadQuestionData() async {
    var questionDataModel = QuestionModel();
    questionDataModel.title = "question";
    final json = jsonEncode(doPrepareQuestionData(questionDataModel));
    await _controller.runJavaScript(
      '''
          getQuestionData('$json');
      ''',
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: WebViewWidget(controller: _controller),
    );
  }
}

class QuestionModel {
  List<String>? images = [];
  late String? type;
  late int? categoryId;
  late int? passageId;
  late String? solution;
  late String? title;
  late int? solutionVideoId;
  late double? points;
  late double? negativePoints;
  late double? difficulty;
  late String? difficultyLevel;
  late double? rating;
  List<String>? skills = [];

  // late List<AnswerModel>? answers;

  // List<HintModel>? hints = [];
  // late String? answerType;

  // late List<FillerMetaModel>? fillerMeta;

  // late List<ConceptParser>? concepts;
  late int? effectiveDifficulty;
  late String? metadata;
}
