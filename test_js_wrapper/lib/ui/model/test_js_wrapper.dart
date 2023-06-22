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

  @override
  Widget build(BuildContext context) {
    return const Placeholder();
  }
}
