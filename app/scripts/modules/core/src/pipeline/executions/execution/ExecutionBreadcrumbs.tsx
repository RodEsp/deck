import React, { useState, useEffect } from 'react';
import { UISref } from '@uirouter/react';

import { ExecutionInformationService } from './executionInformation.service';
import { IExecution } from 'core/domain';

export interface IExecutionBreadcrumbsProps {
  execution: IExecution;
}

export const ExecutionBreadcrumbs: React.FC<IExecutionBreadcrumbsProps> = ({ execution }) => {
  const [executions, setExecutions] = useState([]);

  const informationService = new ExecutionInformationService();

  useEffect(() => {
    const execs = informationService.getAllParentExecutions(execution);
    setExecutions(execs);
  }, []);

  return (
    <div>
      {executions.length > 1 && <span>Execution Path: </span>}
      {executions.length === 1 ? (
        <UISref
          to="home.applications.application.pipelines.executionDetails.execution"
          params={{
            application: executions[0].application,
            executionId: executions[0].id,
            executionParams: {
              application: executions[0].application,
              executionId: executions[0].id,
            },
          }}
          options={{
            inherit: false,
            reload: 'home.applications.application.pipelines.executionDetails',
          }}
        >
          <a style={{ display: 'inline' }} className="execution-build-number clickable">
            {executions[0].name}
          </a>
        </UISref>
      ) : (
        executions.length > 1 &&
        [...executions].reverse().map((execution, index, array) => (
          <React.Fragment key={execution.id}>
            <UISref
              to="home.applications.application.pipelines.executionDetails.execution"
              params={{
                application: execution.application,
                executionId: execution.id,
                executionParams: {
                  application: execution.application,
                  executionId: execution.id,
                },
              }}
              options={{
                inherit: false,
                reload: 'home.applications.application.pipelines.executionDetails',
              }}
            >
              <a style={{ display: 'inline' }} className="execution-build-number clickable">
                {execution.name}
              </a>
            </UISref>
            {index !== array.length - 1 && (
              <span>
                {' '}
                <i className="fas fa-angle-right"></i>{' '}
              </span>
            )}
          </React.Fragment>
        ))
      )}
    </div>
  );
};
