import { DB } from "@/class/Database";
import { exploreRequestBody } from "@/types/payment.type";
import { Context } from "elysia";
const list = async (ctx: Context) => {
  const body = exploreRequestBody.parse(ctx.body);
  if (body?.single) {
    const item = (
      await DB.pool.query(`SELECT * FROM public.items WHERE item_id = $1`, [
        body.single,
      ])
    ).rows[0];
    return {
      status: 200,
      message: "Item fetched successfully",
      data: {
        item: item,
      },
    };
  }
  // Lets build a query!!
  const filterConditions: string[] = [];
  const searchConditions: string[] = [];
  const globalSearchTerms = body?.globalSearch?.split(" ") || [];
  const searchTerms = ["name", "category"];
  if (body?.globalSearch) {
    searchTerms.forEach((t) => {
      globalSearchTerms.forEach((f) => {
        if (t === "category") {
          searchConditions.push(`category::text ILIKE '%${f}%'`);
        } else {
          searchConditions.push(`${t} ILIKE '%${f}%'`);
        }
      });
    });
  }
  if (body?.filter) {
    body.filter.forEach((i) => {
      const fieldName = i.id;
      let fieldValue = i.value as any[];
      const type = i.type;
      if (type === "multi-select") {
        fieldValue = fieldValue.filter((t) => t.length > 0);
        if (fieldValue.length === 0) {
          return;
        }
        if (typeof fieldValue[0] === "string") {
          // Filter out empty strings
          filterConditions.push(
            `${fieldName} IN ('${fieldValue.join(`','`)}')`,
          );
        } else {
          filterConditions.push(`${fieldName} IN (${fieldValue.join(",")})`);
        }
      } else if (type === "date") {
        filterConditions.push(
          `${fieldName} BETWEEN '${fieldValue[0]}'::timestamp AND '${fieldValue[1]}'::timestamp`,
        );
      } else if (type === "range") {
        filterConditions.push(
          `${fieldName} BETWEEN ${fieldValue[0]} AND ${fieldValue[1]}`,
        );
      } else if (type === "global-search") {
        searchConditions.push(`${fieldName}::text ILIKE '%${fieldValue}%'`);
      } else if (type === "single-select") {
        filterConditions.push(`${fieldName} = '${fieldValue}'`);
      }
    });
  }
  const itemsFinalQuery = `
    SELECT * FROM public.items i
    ${
      searchConditions.length > 0 || filterConditions.length > 0
        ? `WHERE ${filterConditions.length > 0 ? "(" + filterConditions.join(" AND \n ") + ")" : ""}
        ${filterConditions.length > 0 && searchConditions.length > 0 ? " AND " : ""}
        ${searchConditions.length > 0 ? "(" + searchConditions.join(" OR \n ") + ")" : ""}`
        : ""
    }
    ${
      body?.sorting
        ? `ORDER BY ${body.sorting.id} ${body.sorting.desc ? "DESC" : "ASC"}`
        : `ORDER BY order_frequency DESC`
    }
    ${body?.limit ? `LIMIT ${body.limit}` : ""}
    ${body?.offset ? `OFFSET ${body.offset}` : ""}
  `;
  console.log("itemsFinalQuery", itemsFinalQuery);

  const itemList = (await DB.pool.query(itemsFinalQuery)).rows;
  const data = {
    items: itemList,
  };
  return {
    status: 200,
    message: "Items fetched successfully",
    data,
  };
};

export default {
  list,
};
