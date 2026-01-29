"use client";

import { useState } from "react";

interface SurveyResponse {
  id: string;
  question: string;
  responses: {
    likely: number;
    unlikely: number;
    neutral: number;
  };
  comments: string[];
  totalResponses: number;
}

const CompanySentimentSurvey = () => {
  const [activeTab, setActiveTab] = useState<"analytics" | "raw">("analytics");
  const [surveyData] = useState<SurveyResponse[]>([
    {
      id: "1",
      question: "How likely are you to recommend this company to others?",
      responses: {
        likely: 45,
        unlikely: 8,
        neutral: 12,
      },
      comments: [
        "Excellent service and professional team",
        "Great communication throughout the project",
        "Would definitely work with them again",
        "Some delays in delivery but overall satisfied",
        "Very knowledgeable team with innovative solutions",
      ],
      totalResponses: 65,
    },
    {
      id: "2",
      question: "How satisfied are you with the quality of work delivered?",
      responses: {
        likely: 52,
        unlikely: 3,
        neutral: 10,
      },
      comments: [
        "Exceeded expectations in every way",
        "High-quality deliverables on time",
        "Very professional and thorough work",
        "Good quality but could be faster",
        "Excellent attention to detail",
      ],
      totalResponses: 65,
    },
    {
      id: "3",
      question:
        "How likely are you to engage with this company for future projects?",
      responses: {
        likely: 38,
        unlikely: 12,
        neutral: 15,
      },
      comments: [
        "Already planning our next project together",
        "Would consider for future work",
        "Great partnership potential",
        "Need to see more results first",
        "Very reliable and trustworthy",
      ],
      totalResponses: 65,
    },
  ]);

  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-sidebartext">
          Sentiment Survey Results
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              activeTab === "analytics"
                ? "bg-primary text-bgwhite"
                : "bg-gray-100 text-labelprimary hover:bg-gray-200 dark:bg-labelprimary dark:text-darklabelprimary dark:hover:bg-gray-600"
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab("raw")}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              activeTab === "raw"
                ? "bg-primary text-bgwhite"
                : "bg-gray-100 text-labelprimary hover:bg-gray-200 dark:bg-labelprimary dark:text-darklabelprimary dark:hover:bg-gray-600"
            }`}
          >
            Raw Responses
          </button>
        </div>
      </div>

      {activeTab === "analytics" ? (
        <div className="space-y-6">
          {surveyData.map((survey) => (
            <div
              key={survey.id}
              className="border bordergray200 dark:border-labelprimary rounded-lg p-6"
            >
              <h4 className="text-lg font-medium text-gray-900 dark:text-sidebartext mb-4">
                {survey.question}
              </h4>

              {/* Response Chart */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:bordercolor1">
                    Total Responses: {survey.totalResponses}
                  </span>
                </div>
                <div className="flex h-8 bg-gray-200 dark:bg-labelprimary rounded-lg overflow-hidden">
                  <div
                    className="bg-green-500 flex items-center justify-center text-bgwhite text-[0.875] font-medium"
                    style={{
                      width: `${calculatePercentage(survey.responses.likely, survey.totalResponses)}%`,
                    }}
                  >
                    {survey.responses.likely} (
                    {calculatePercentage(
                      survey.responses.likely,
                      survey.totalResponses,
                    )}
                    %)
                  </div>
                  <div
                    className="bg-yellow-500 flex items-center justify-center text-bgwhite text-[0.875] font-medium"
                    style={{
                      width: `${calculatePercentage(survey.responses.neutral, survey.totalResponses)}%`,
                    }}
                  >
                    {survey.responses.neutral} (
                    {calculatePercentage(
                      survey.responses.neutral,
                      survey.totalResponses,
                    )}
                    %)
                  </div>
                  <div
                    className="bg-red-500 flex items-center justify-center text-bgwhite text-[0.875] font-medium"
                    style={{
                      width: `${calculatePercentage(survey.responses.unlikely, survey.totalResponses)}%`,
                    }}
                  >
                    {survey.responses.unlikely} (
                    {calculatePercentage(
                      survey.responses.unlikely,
                      survey.totalResponses,
                    )}
                    %)
                  </div>
                </div>
                <div className="flex justify-between text-[0.875rem] text-sidebartext dark:bordercolor1 mt-1">
                  <span>Likely</span>
                  <span>Neutral</span>
                  <span>Unlikely</span>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {calculatePercentage(
                      survey.responses.likely,
                      survey.totalResponses,
                    )}
                    %
                  </div>
                  <div className="text-sm text-gray-600 dark:bordercolor1">
                    Likely
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {calculatePercentage(
                      survey.responses.neutral,
                      survey.totalResponses,
                    )}
                    %
                  </div>
                  <div className="text-sm text-gray-600 dark:bordercolor1">
                    Neutral
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {calculatePercentage(
                      survey.responses.unlikely,
                      survey.totalResponses,
                    )}
                    %
                  </div>
                  <div className="text-sm text-gray-600 dark:bordercolor1">
                    Unlikely
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {surveyData.map((survey) => (
            <div
              key={survey.id}
              className="border bordergray200 dark:border-labelprimary rounded-lg p-6"
            >
              <h4 className="text-lg font-medium text-gray-900 dark:text-sidebartext mb-4">
                {survey.question}
              </h4>

              {/* Comments */}
              <div>
                <h5 className="text-sm font-medium text-labelprimary dark:text-darklabelprimary mb-3">
                  Free-text Comments ({survey.comments.length})
                </h5>
                <div className="space-y-3">
                  {survey.comments.map((comment, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-darkbgprimary rounded-lg p-3"
                    >
                      <p className="text-labelprimary dark:text-darklabelprimary text-sm">
                        {`${comment}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Response Breakdown */}
              <div className="mt-6">
                <h5 className="text-sm font-medium text-labelprimary dark:text-darklabelprimary mb-3">
                  Response Breakdown
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:bordercolor1">
                      Likely
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-sidebartext">
                      {survey.responses.likely} responses
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:bordercolor1">
                      Neutral
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-sidebartext">
                      {survey.responses.neutral} responses
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:bordercolor1">
                      Unlikely
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-sidebartext">
                      {survey.responses.unlikely} responses
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Statistics */}
      <div className="mt-8 bg-gray-50 dark:bg-darkbgprimary rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 dark:text-sidebartext mb-4">
          Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(
                surveyData.reduce(
                  (acc, survey) =>
                    acc +
                    calculatePercentage(
                      survey.responses.likely,
                      survey.totalResponses,
                    ),
                  0,
                ) / surveyData.length,
              )}
              %
            </div>
            <div className="text-sm text-gray-600 dark:bordercolor1">
              Average Likely
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {surveyData.reduce(
                (acc, survey) => acc + survey.totalResponses,
                0,
              )}
            </div>
            <div className="text-sm text-gray-600 dark:bordercolor1">
              Total Responses
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {surveyData.length}
            </div>
            <div className="text-sm text-gray-600 dark:bordercolor1">
              Survey Questions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySentimentSurvey;
