import { containsVariable, QueryVariableModel, VariableRefresh } from '../variable';
import { ALL_VARIABLE_TEXT, queryVariableReducer, QueryVariableState } from '../state/queryVariableReducer';
import { dispatch } from '../../../store/store';
import { setOptionAsCurrent, setOptionFromUrl } from '../state/actions';
import { VariableAdapter } from './index';
import { QueryVariablePicker } from '../picker/QueryVariablePicker';
import { QueryVariableEditor } from '../editor/QueryVariableEditor';
import { updateQueryVariableOptions } from '../state/queryVariableActions';

export const createQueryVariableAdapter = (): VariableAdapter<QueryVariableModel, QueryVariableState> => {
  return {
    description: 'Variable values are fetched from a datasource query',
    reducer: queryVariableReducer,
    picker: QueryVariablePicker,
    editor: QueryVariableEditor,
    dependsOn: (variable, variableToTest) => {
      return containsVariable(variable.query, variable.datasource, variable.regex, variableToTest.name);
    },
    setValue: async (variable, option) => {
      return new Promise(async resolve => {
        await dispatch(setOptionAsCurrent(variable, option));
        resolve();
      });
    },
    setValueFromUrl: async (variable, urlValue) => {
      return new Promise(async resolve => {
        await dispatch(setOptionFromUrl(variable, urlValue));
        resolve();
      });
    },
    updateOptions: async (variable, searchFilter, notifyAngular) => {
      await dispatch(updateQueryVariableOptions(variable, searchFilter, notifyAngular));
    },
    getSaveModel: variable => {
      const { index, uuid, initLock, global, ...rest } = variable;
      // remove options
      if (variable.refresh !== VariableRefresh.never) {
        return { ...rest, options: [] };
      }

      return rest;
    },
    getValueForUrl: variable => {
      if (variable.current.text === ALL_VARIABLE_TEXT) {
        return ALL_VARIABLE_TEXT;
      }
      return variable.current.value;
    },
  };
};
