import Model from "./model";
import { Database } from "../db";
import { ITask } from "../classes/task";
import Labels from "./labels";
import { StringUtils } from "../../utils/string";
import { SUCCESS_FALSE, SUCCESS_TRUE } from "../../core/types";
import { TaskStatus } from "../classes/task.status";
import { error, log } from "console";

export default class Tasks implements Model {
  /**
   * Get the task matching the given name text
   * @param db  The database connection
   * @param username The user to search for
   * @param searcher The text to search for
   * @returns The query result
   */
  public static async searchTasksByName(
    db: Database,
    username: string,
    searcher: string,
  ): Promise<any> {
    const SQL = "SELECT * FROM task WHERE author = ?";
    let response = await db.db.all(SQL, username);

    response = response.filter((task: ITask) =>
      StringUtils.containsMatching(task.name || "", searcher),
    );
    return new Promise((success) => success(response));
  }

  /**
   *
   * @param db The databas3e connection
   * @param username The user who owns the tasks
   * @returns The query result
   */
  public static getUserTasks(db: Database, username: string): Promise<any> {
    const SQL = "SELECT * FROM task WHERE author = ? ORDER BY end DESC";
    const response = db.db.all(SQL, username);
    return response;
  }

  /**
   *
   * @param db The databas3e connection
   * @param username The user who owns the tasks
   * @returns The query result
   */
  public static getUserDoneTasks(db: Database, username: string): Promise<any> {
    const SQL =
      "SELECT * FROM task WHERE author = ? AND done=1 ORDER BY end DESC";
    const response = db.db.all(SQL, username);
    return response;
  }

  /**
   *
   * @param db The databas3e connection
   * @param username The user who owns the tasks
   * @returns The query result
   */
  public static getUserNotDoneTasks(
    db: Database,
    username: string,
  ): Promise<any> {
    const SQL =
      "SELECT * FROM task WHERE author = ? AND done=0 ORDER BY end DESC";
    const response = db.db.all(SQL, username);
    return response;
  }

  /**
   *
   * @param db The databas3e connection
   * @param username The user who owns the tasks
   * @returns The query result
   */
  public static getUserTask(db: Database, id: string): Promise<any> {
    const SQL = "SELECT * FROM task WHERE id = ?";
    const response = db.db.all(SQL, id);
    return response;
  }

  /**
   * Get the user tasks from a given category
   * @param db The database connection
   * @param username The user to search for
   * @param category The category to search for
   * @returns The query result
   */
  public static getUserTasksFromCategory(
    db: Database,
    username: string,
    category: string,
  ): Promise<any> {
    const SQL =
      "SELECT * FROM task WHERE author = ? AND id IN (SELECT taskId FROM task_label WHERE label = ?) ORDER BY end DESC";
    const response = db.db.all(SQL, username, category);
    return response;
  }

  /**
   * Get the user tasks without category
   * @param db The database connection
   * @param username The user to search for
   * @returns The query result
   */
  public static getUserTasksWithoutCategory(
    db: Database,
    username: string,
  ): Promise<any> {
    const SQL =
      "SELECT * FROM task WHERE author = ? AND id NOT IN (SELECT taskId FROM task_label) ORDER BY end DESC";
    const response = db.db.all(SQL, username);
    return response;
  }

  /**
   * Get the user done tasks from a given category
   * @param db The database connection
   * @param username The user to search for
   * @param category The category to search for
   * @returns The query result
   */
  public static getUserDoneTasksFromCategory(
    db: Database,
    username: string,
    category: string,
  ): Promise<any> {
    const SQL =
      "SELECT * FROM task WHERE author = ? AND done=1 AND id IN (SELECT taskId FROM task_label WHERE label = ?) ORDER BY end DESC";
    const response = db.db.all(SQL, username, category);
    return response;
  }

  /**
   * Get the user done tasks without category
   * @param db The database connection
   * @param username The user to search for
   * @param category The category to search for
   * @returns The query result
   */
  public static getUserDoneTasksFromNoCategory(
    db: Database,
    username: string,
  ): Promise<any> {
    const SQL =
      "SELECT * FROM task WHERE author = ? AND done=1 AND id NOT IN (SELECT taskId FROM task_label) ORDER BY end DESC";
    const response = db.db.all(SQL, username);
    return response;
  }

  /**
   * Get the user not done tasks from a given category
   * @param db The database connection
   * @param username The user to search for
   * @param category The category to search for
   * @returns The query result
   */
  public static getUserNotDoneTasksFromCategory(
    db: Database,
    username: string,
    category: string,
  ): Promise<any> {
    const SQL =
      "SELECT * FROM task WHERE author = ? AND done=0 AND id IN (SELECT taskId FROM task_label WHERE label = ?) ORDER BY end DESC";
    const response = db.db.all(SQL, username, category);
    return response;
  }

  /**
   * Get the user not done tasks from a given category
   * @param db The database connection
   * @param username The user to search for
   * @param category The category to search for
   * @returns The query result
   */
  public static getUserNotDoneTasksFromNoCategory(
    db: Database,
    username: string,
  ): Promise<any> {
    const SQL =
      "SELECT * FROM task WHERE author = ? AND done=0 AND id NOT IN (SELECT taskId FROM task_label) ORDER BY end DESC";
    const response = db.db.all(SQL, username);
    return response;
  }

  /**
   * Insert a task for a given user
   * @param db The databse connection
   * @param task The task to be inserted
   */
  public static async insertUserTask(db: Database, task: ITask) {
    const SQL =
      "INSERT INTO task(author, name, description, start, end, allDay, done, status) VALUES (?,?,?,?,?,?,?,?)";
    const response = await db.db.run(
      SQL,
      task.author,
      task.name,
      task.description,
      task.start,
      task.end,
      task.allDay,
      task.done,
      task.status || TaskStatus.TODO,
    );

    if (!response) return SUCCESS_FALSE;

    if (response.length >= 0) return SUCCESS_FALSE;

    if (response.changes == 0) return SUCCESS_FALSE;

    task.labels?.forEach((tag) =>
      Labels.setLabelToTask(db, response.lastID, tag),
    );

    return SUCCESS_TRUE;
  }

  /**
   * Delete a task from a given user
   * @param db The database connection
   * @param task The task to be deleted
   * @returns The query result
   */
  public static async deleteUserTask(db: Database, task: ITask) {
    const SQL = "DELETE FROM task WHERE id = ?";
    const response = await db.db.run(SQL, task.id);

    if (!response) return SUCCESS_FALSE;

    if (response.length >= 0) return SUCCESS_FALSE;

    if (response.changes == 0) return SUCCESS_FALSE;

    return SUCCESS_TRUE;
  }

  /**
   * Get the month tasks for a given user
   * @param db The database connection
   * @param author The user to search for
   * @param year The year to search for
   * @param month The month to search for
   * @returns The query result
   */
  public static async getUserMonthTasks(
    db: Database,
    author: string,
    year: string,
    month: string,
  ) {
    const SQL = "SELECT * FROM task WHERE author=? AND start BETWEEN ? AND ?";
    const response = db.db.all(
      SQL,
      author,
      year + "-" + month + "-00 00:00",
      year + "-" + month + "-32 23:59",
    );

    return response;
  }

  /**
   * Update the given task
   * @param db The database connection
   * @param task The task to update
   * @returns The query result
   */
  public static async updateUserTask(db: Database, task: ITask) {
    const SQL =
      "UPDATE task SET name=?, description=?, start=?, end=?, allDay=?, status=?, done=? WHERE id=?";

    const response = await db.db.run(
      SQL,
      task.name,
      task.description,
      task.start,
      task.end,
      task.allDay,
      task.status,
      task.done,
      task.id,
    );

    error(JSON.stringify(response, null, 2));

    if (!response) return SUCCESS_FALSE;

    if (response.length >= 0) return SUCCESS_FALSE;

    if (response.changes == 0) return SUCCESS_FALSE;

    return SUCCESS_TRUE;
  }

  /**
   * Update the tasks done status for a given task
   * @param db The database connection
   * @param task The task to update
   * @returns The query result
   */
  public static async updateUserTaskDone(db: Database, task: ITask) {
    const SQL = "UPDATE task SET done=? WHERE id=?";
    const response = await db.db.run(SQL, task.done, task.id);

    if (!response) return SUCCESS_FALSE;

    if (response.length >= 0) return SUCCESS_FALSE;

    if (response.changes == 0) return SUCCESS_FALSE;

    return SUCCESS_TRUE;
  }
}
