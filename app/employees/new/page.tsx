import Link from "next/link";
import { redirect } from "next/navigation";

import { saveEmployee } from "@/lib/store";

function getFormValue(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

async function createEmployeeAction(formData: FormData) {
  "use server";

  const employee = await saveEmployee({
    employeeCode: getFormValue(formData, "employeeCode"),
    name: getFormValue(formData, "name"),
    nameKana: getFormValue(formData, "nameKana"),
    birthday: getFormValue(formData, "birthday"),
    address: getFormValue(formData, "address"),
    joinDate: getFormValue(formData, "joinDate"),
    commuteMethod: getFormValue(formData, "commuteMethod"),
    futureVision: getFormValue(formData, "futureVision"),
    memo: getFormValue(formData, "memo"),
  });

  redirect(`/employees/${employee.id}`);
}

export default function NewEmployeePage() {
  return (
    <>
      <header className="app-header">
        <div className="app-header__inner">
          <Link className="brand-link" href="/">
            <h1>社員カルテDB</h1>
            <p>Employee Profile Database</p>
          </Link>

          <div className="app-header__badge">New Employee</div>
        </div>
      </header>

      <main className="container">
        <section className="page-head">
          <div>
            <p className="eyebrow">Create Employee</p>
            <h2>社員登録</h2>
            <p className="sub-text">
              社員の基本情報を登録します。詳細項目はあとから編集できます。
            </p>
          </div>

          <Link className="btn ghost" href="/">
            一覧へ戻る
          </Link>
        </section>

        <section className="card">
          <form className="employee-form" action={createEmployeeAction}>
            <div className="form-grid">
              <label className="form-field">
                <span>社員番号</span>
                <input
                  type="text"
                  name="employeeCode"
                  placeholder="例：TNG-001"
                />
              </label>

              <label className="form-field">
                <span>氏名</span>
                <input
                  type="text"
                  name="name"
                  placeholder="例：山田 太郎"
                  required
                />
              </label>

              <label className="form-field">
                <span>カナ</span>
                <input
                  type="text"
                  name="nameKana"
                  placeholder="例：ヤマダ タロウ"
                />
              </label>

              <label className="form-field">
                <span>生年月日</span>
                <input type="date" name="birthday" />
              </label>

              <label className="form-field">
                <span>入社日</span>
                <input type="date" name="joinDate" />
              </label>

              <label className="form-field">
                <span>通勤方法</span>
                <input
                  type="text"
                  name="commuteMethod"
                  placeholder="例：電車 / 車 / 徒歩"
                />
              </label>

              <label className="form-field full">
                <span>住所</span>
                <input
                  type="text"
                  name="address"
                  placeholder="例：北海道札幌市..."
                />
              </label>

              <label className="form-field full">
                <span>将来像</span>
                <textarea
                  name="futureVision"
                  rows={4}
                  placeholder="本人が目指している方向性など"
                />
              </label>

              <label className="form-field full">
                <span>メモ</span>
                <textarea
                  name="memo"
                  rows={5}
                  placeholder="面談で気づいたこと、補足事項など"
                />
              </label>
            </div>

            <div className="form-actions">
              <Link className="btn ghost" href="/">
                キャンセル
              </Link>

              <button className="btn primary" type="submit">
                登録する
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}