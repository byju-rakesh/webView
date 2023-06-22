import 'dart:collection';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:test_js_wrapper/ui/model/answer_proceesed_listner.dart';
import 'package:webview_flutter/webview_flutter.dart';

class TestJsWrapper extends StatelessWidget {
  String MODE_SOLUTION = "solution";
  String MODE_VIEW_SOLUTION = "view_solution";
  String MODE_QUESTION = "question";
  String TEST_BASE_URL = "file:///android_asset/testEngineScripts";
  String CUSTOM_IMAGE_TAG = "tnl://";
  String IMAGE_FOLDER = "images/";
  final String mode;
  final String downloadFilePath;
  final String videoThumbnailBaseUrl;
  final double defaultQuestionId;
  int subjectStartColor = 0;
  int subjectEndColor = 0;
  final String subjectName;
  final String assessmentId;
  final OnAnswerProcessedListener onAnswerProcessedListener;
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
    required this.onAnswerProcessedListener,
    required this.isStyleCustomized,
    required this.isInAdaptiveFlow,
    required this.isTopPaddingRequired,
    required this.isExtraBottomSpaceRequired,
    required this.disableSolutionInOptions,
  });
  //  String getQuestionData(int questionId) {

  //           return _prepareQuestionData(questionId);
  //       }
  //        String _prepareQuestionData(int questionId) {

  //       try {

  //           int longQuestionId =  questionId;
  //          // QuestionModel questionParser = questionModelMap.get(longQuestionId);

  //           // if (questionParser == null) {
  //           //     return "";
  //           // }

  //           int questionPosition = positionMap.get(longQuestionId);

  //           JSONObject inputJson = doPrepareQuestionData(questionParser);
  //           inputJson.put("id", questionParser.getId());

  //           if (mode.toLowerCase()== (MODE_SOLUTION.toLowerCase())) {
  //               inputJson.put("q_num", questionPosition + 1);
  //           }

  //           String jsonString = inputJson.toString();
  //           //Timber.v("questionId : " + questionId + " : " + questionPosition + " =>" + jsonString);
  //           return jsonString;
  //       } catch (e) {

  //          // Timber.e("getQuestionData : " + e.getMessage());
  //       }

  //       return "";
  //   }

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

    var startColor = '#${subjectStartColor.toRadixString(16)}';
    var endColor = '#${subjectEndColor.toRadixString(16)}';
    if (!isStyleCustomized) {
      startColor = '#000000';
      endColor = '#000000';
    }

    jsonObj['subject_color'] = endColor;
    jsonObj['isStyleCustomized'] = isStyleCustomized;
    jsonObj['isTopPaddingRequired'] = isTopPaddingRequired;
    // jsonObj['isTablet'] = ViewUtils.isTablet(webView.context);
    jsonObj['isExtraBottomSpaceRequired'] = isExtraBottomSpaceRequired;
    jsonObj['disableSolutionInOptions'] = disableSolutionInOptions;

    jsonObj['answers'] = ""; //prepareAnswerData(questionParser);

    return jsonObj;
  }

  @override
  Widget build(BuildContext context) {
    return const Placeholder();
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
