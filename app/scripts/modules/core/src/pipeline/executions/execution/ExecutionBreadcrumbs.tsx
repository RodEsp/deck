import React, { MouseEventHandler } from 'react';
import { useSref } from '@uirouter/react';
import ReactGA from 'react-ga';
import { ReactInjector } from 'core/reactShims';

import { ExecutionInformationService } from './executionInformation.service';
import { IExecution } from 'core/domain';

export interface IExecutionBreadcrumbsProps {
  execution: IExecution;
}

export const ExecutionBreadcrumbs = ({ execution }: IExecutionBreadcrumbsProps) => {
  const parentExecutions = React.useMemo(() => {
    return new ExecutionInformationService()
      .getAllParentExecutions(execution)
      .filter((x) => x !== execution)
      .reverse();
  }, []);

  return (
    <div>
      <span>Parent Executions: </span>
      {parentExecutions.map((execution, index, array) => (
        <React.Fragment key={execution.id}>
          <ParentExecutionLink execution={execution} />
          {index !== array.length - 1 && <i className="fas fa-angle-right execution-breadcrumb-marker"></i>}
        </React.Fragment>
      ))}
    </div>
  );
};

function ParentExecutionLink({ execution }: IExecutionBreadcrumbsProps) {
  const { $state } = ReactInjector;
  const { application, id: executionId } = execution;

  const toState = `${$state.current.name.endsWith('.execution') ? '^' : ''}.^.executionDetails.execution`;
  const srefParams = { application, executionId };
  const srefOptions = {
    inherit: false,
    reload: 'home.applications.application.pipelines.executionDetails',
  };
  const sref = useSref(toState, srefParams, srefOptions);

  const handleClick: MouseEventHandler<any> = (e) => {
    ReactGA.event({ category: 'Pipeline', action: 'Execution build number clicked - parent pipeline' });
    sref.onClick(e);
  };

  return (
    <a
      href={sref.href}
      onClick={handleClick}
      style={{ display: 'inline' }}
      className="execution-build-number clickable"
    >
      {execution.name}
    </a>
  );
}
