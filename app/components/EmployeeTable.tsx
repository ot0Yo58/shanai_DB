"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import type { Employee } from "@/types/employee";

type EmployeeTableProps = {
  employees: Employee[];
  searchText: string;
};

function displayValue(value: string | undefined): string {
  return value && value.trim() !== "" ? value : "-";
}

export default function EmployeeTable({
  employees,
  searchText,
}: EmployeeTableProps) {
  const router = useRouter();

  return (
    <div className="table-scroll">
      <table className="data-table employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>社員番号</th>
            <th>名前</th>
            <th>カナ</th>
            <th>入社日</th>
            <th>通勤方法</th>
            <th>操作</th>
          </tr>
        </thead>

        <tbody>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <tr
                className="clickable-row"
                key={employee.id}
                title="ダブルクリックで詳細を開く"
                onDoubleClick={() => router.push(`/employees/${employee.id}`)}
              >
                <td data-label="ID">{displayValue(employee.id)}</td>
                <td data-label="社員番号">
                  {displayValue(employee.employeeCode)}
                </td>
                <td data-label="名前">
                  <Link
                    className="table-main-link"
                    href={`/employees/${employee.id}`}
                  >
                    {displayValue(employee.name)}
                  </Link>
                </td>
                <td data-label="カナ">{displayValue(employee.nameKana)}</td>
                <td data-label="入社日">{displayValue(employee.joinDate)}</td>
                <td data-label="通勤方法">
                  {displayValue(employee.commuteMethod)}
                </td>
                <td className="actions-cell" data-label="操作">
                  <Link className="mini-btn" href={`/employees/${employee.id}`}>
                    詳細
                  </Link>
                  <Link
                    className="mini-btn ghost"
                    href={`/employees/${employee.id}/edit`}
                  >
                    編集
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr className="empty-row">
              <td className="empty" colSpan={7}>
                {searchText
                  ? "検索条件に一致する社員データがありません。"
                  : "社員データがありません。まずは社員登録からデータを追加してください。"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}